const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const path = require('path')

const app = express()

app.use(cors())
app.use(morgan('tiny'))

function getResults(body) {
  const $ = cheerio.load(body)
  const rows = $('li.result-row')
  const offerRows = $('a._109rpto._1anrh0x')
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

  offerRows.each((index, element) => {
    const offerResult = $(element)
    const title = offerResult.find('._nn5xny4._y9ev9r').text()
    const images = offerResult.find('img._ipfql6._sheya5').attr('data-src')
    const price = offerResult.find('._s3g03e4').text()
    const hood = offerResult.find('._19rx43s2').text()

    let url = `https://offerup.com/${offerResult.attr('href')}`

    const id = index

    results.push({
      id,
      title,
      images,
      price,
      hood,
      url
    })
  })
  return results
}

app.get('/search/:location/:search_term', (req, res) => {
  const { location, search_term } = req.params

  allResults = []

  const offerUrl = `https://offerup.com/search/?q=${search_term}&sort=-posted`
  const url = `https://${location}.craigslist.org/search/sso?sort=date&query=${search_term}&hasPic=1`

  fetch(offerUrl)
    .then(res => res.text())
    .then(body => {
      const results = getResults(body)
      allResults.push.apply(allResults, results)
      return fetch(url)
    })
    .then(res => res.text())
    .catch(err => console.log(err))
    .then(body => {
      const results = getResults(body)
      allResults.push.apply(allResults, results)
      res.json({ allResults })
    })
})

if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}`));