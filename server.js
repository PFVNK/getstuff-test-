const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const path = require('path')

const app = express()

app.use(cors())
app.use(morgan('tiny'))

app.use(express.static(path.join(__dirname, 'client/build')));

function getResults(body) {
  const $ = cheerio.load(body)
  const rows = $('li.result-row')
  const results = []


  rows.each((index, element) => {
    const result = $(element)
    const title = result.find('.result-title').text()
    const price = $(result.find('.result-price').get(0)).text()
    const imageData = result.find('a.result-image').attr('data-ids')
    let images = []
    if (imageData) {
      const parts = imageData.split(',')
      images = parts.map((id) => {
        return `https://images.craigslist.org/${id.split(':')[1]}_300x300.jpg`
      })
    }
    const hood = result.find('.result-hood').text().trim().replace("(", "").replace(")", "")
    let url = result.find('.result-title.hdrlnk').attr('href')
    const id = index
    const dateAdded = result.find('.result-date').attr('datetime').slice(0, 10)

    results.push({
      id,
      title,
      price,
      images: images[0],
      hood,
      url,
      dateAdded
    })
  })

  return results
}

app.get('/search/:location/:search_term', (req, res) => {
  const { location, search_term } = req.params

  allResults = []

  const url = `https://${location}.craigslist.org/search/sso?sort=date&query=${search_term}&hasPic=1`

  fetch(url)
    .then(res => res.text())
    .then(body => {
      const results = getResults(body)
      console.log(results)
      res.json({ results })
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}`));