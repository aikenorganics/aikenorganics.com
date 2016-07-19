'use strict'

const db = require('../../db')
const json = require('../../json/admin/products')
const router = module.exports = require('ozymandias').Router()

router.get('/', (req, res) => {
  let products = db.Product.include('grower')

  const oversold = req.query.oversold === '1'
  const page = +(req.query.page || 1)

  // Oversold?
  if (oversold) products.where('reserved > supply')

  // Search
  if (req.query.search) products = products.search(req.query.search)

  products.order('name').paginate(page, 100).then((products) => {
    res.react(json.index, {oversold, page, products})
  }).catch(res.error)
})
