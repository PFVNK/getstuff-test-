import React, { Component } from 'react'
import Push from 'push.js'

import Navbar from './Components/Navbar'
import Gallery from './Components/Gallery'
import './App.css'


const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

const API_URL = '/search/houston/'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      tagResults: [],
      mixedResults: [],
      items: [],
      itemCount: 0
    }
  }

  componentDidMount() {
    let tags = window.localStorage.length > 0 ? JSON.parse(localStorage.getItem('tags')) : this.state.tags

    setTimeout(this.lazyLoad, 3000)

    this.setState({ tags },
      this.fetchAndStore
    )

    setInterval(this.fetchSave, 3600000)
  }

  componentDidUpdate(prevProps, prevState) {
    const { tags } = this.state
    let prevMixedResults = prevState.mixedResults.length
    let mixedResults = this.state.mixedResults.length

    if (prevMixedResults !== mixedResults && tags.length > 0) {
      let resultDiff = (prevMixedResults > mixedResults) ? prevMixedResults - mixedResults : mixedResults - prevMixedResults

      Push.create(`You have ${resultDiff} new items to view!`, {
        requireInteraction: 'true',
        onClick: function () {
          window.focus()
          this.close()
        }
      })
    } else { return }

    window.scrollTo(0, 0)
  }

  fetchSave = () => {
    this.saveToLocal()
    this.fetchAndStore()
    setTimeout(this.lazyLoad, 5000)
  }

  deleteSave = () => {
    this.saveToLocal()
    this.fetchAndStore()
    setTimeout(this.lazyLoad, 5000)
  }

  lazyLoad = () => {
    const { mixedResults, itemCount } = this.state
    if (mixedResults.length > 0) {
      const items = mixedResults.slice(0, itemCount + 12)
      this.setState({
        itemCount: itemCount + 12,
        items
      })
    }
  }

  mixResults = () => {
    const { tagResults } = this.state

    let uniqueResults = tagResults.reduce((unique, o) => {
      if (!unique.some(obj => obj.title === o.title)) {
        unique.push(o)
      }
      return unique
    }, [])

    const mixedResults = uniqueResults.sort((a, b) => {
      return a.id - b.id || a.title.localeCompare(b.title)
    })

    this.setState({ mixedResults })
  }

  saveToLocal = () => {
    const { tags } = this.state
    localStorage.setItem('tags', JSON.stringify(tags))
  }

  fetchAndStore = () => {
    const { tags } = this.state

    let tagString = []

    tags.map((x, index) =>
      tagString.push(`|+${x.text}+`)
    )

    const craigUrl = `${API_URL}${tagString.join('').slice(2, -1)}`

    fetch(craigUrl)
      .then(response => response.json())
      .then(json => this.setState({ tagResults: json.results.flat(Infinity) || [] }))
      .then(this.mixResults)
  }

  handleDelete = (i) => {
    const { tags } = this.state
    this.setState(
      {
        tags: tags.filter((tag, index) => index !== i),
        items: [],
        tagResults: [],
        itemCount: 0,
        mixedResults: []
      },
      () => {
        this.deleteSave()
      }
    )
  }

  handleAddition = (tag) => {
    const { tags } = this.state
    if (tags.length < 3) {
      this.setState({
        tags: [...tags, tag],
        itemCount: 0
      },
        () => {
          this.fetchSave()
        }
      )
    }
  }

  handleDrag = (tag, currPos, newPos) => {
    const { tags } = this.state
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    this.setState({ tags: newTags })
  }

  render() {
    const { tags, tagResults, items } = this.state
    return (
      <div className="App">
        <Navbar
          tags={tags}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
        />
        <Gallery
          tags={tags}
          lazyLoad={this.lazyLoad}
          tagResults={tagResults}
          items={items}
        />
      </div>
    );
  }
}

export default App;
