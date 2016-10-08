'use strict'

const db = require('../../db')
const json = require('../../json/admin/products')
const router = module.exports = require('ozymandias').Router()

router.get('/', (request, response) => {
  let products = db.Product.include('grower')

  const oversold = request.query.oversold === '1'
  const page = +(request.query.page || 1)

  // Oversold?
  if (oversold) products.where('reserved > supply')

  // Search
  const {search} = request.query
  if (search) products = products.search(search)

  products.order('name').paginate(page, 100).then((products) => {
    response.react(json.index, {oversold, page, products, search})
  }).catch(response.error)
})
