'use strict'

const db = require('../../db')
const router = module.exports = require('ozymandias').Router()

router.get('/', (req, res) => {
  let products = db.Product.include('grower')

  const oversold = req.query.oversold === '1'
  const page = res.locals.page = +(req.query.page || 1)

  // Oversold?
  if (oversold) products.where('reserved > supply')

  // Search
  if (req.query.search) {
    products = products.where(
      "search @@ to_tsquery('simple', ?)", `${req.query.search}:*`
    )
  }

  products.order('name').paginate(page, 100).then((products) => {
    res.react({
      more: products.more,
      oversold: oversold,
      page: page,
      products: products
    })
  }).catch(res.error)
})
