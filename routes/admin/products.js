'use strict'

let db = require('../../db')
let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

router.get('/', function (req, res) {
  let query = db.Product.include('grower')
  if (req.query.oversold === '1') query.where('reserved > supply')
  query.all().then(function (products) {
    res.render('admin/products/index', {products: products})
  }).catch(res.error)
})
