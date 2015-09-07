'use strict'

let ozymandias = require('ozymandias')
let request = require('request')
let router = module.exports = ozymandias.Router()

let BUCKET = process.env.BUCKET

if (BUCKET) {
  router.get('*', function (req, res) {
    request(`https://s3.amazonaws.com/${BUCKET}${req.url}`).pipe(res)
  })
}
