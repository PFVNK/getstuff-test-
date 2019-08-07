import React, { Component } from 'react'
import StackGrid from 'react-stack-grid'
import Loader from 'react-loader-spinner'
import BottomScrollListener from 'react-bottom-scroll-listener'


import '../App.css';


class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 3000)
  }


  render() {
    const { isLoading } = this.state
    const { tagResults, items, lazyLoad } = this.props
    return (
      <>
        <div className='gallery-main'>
          {isLoading && tagResults !== true ?
            <Loader
              style={'gallery-spinner'}
              type="Grid"
              color="#a8ff78"
              height="200"
              width="200"
            />
            :
            <div>
              <StackGrid
                className='gallery-grid'
                columnWidth={300}
                monitorImagesLoaded={true}
                gutterHeight={9}
                gutterWidth={7}>
                {items.map((x, index) => <div key={index} className='gallery-item-wrap'><div key={index} className='gallery-item'>
                  <a href={x.url} target='_blank' rel="noopener noreferrer"><img className='gallery-img' src={x.images} alt={x.title} /></a>
                  <a href={x.url} target='_blank' rel="noopener noreferrer"><h2>{x.title}</h2></a>
                  <h3>PRICE: {x.price}</h3>
                  <p>LOCATION: {x.hood}</p>
                </div></div>)}
              </StackGrid>
              <BottomScrollListener onBottom={lazyLoad} offset={300} />
            </div>
          }
        </div>
      </>
    )
  }
}


export default Gallery