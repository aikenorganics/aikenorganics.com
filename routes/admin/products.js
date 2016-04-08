'use strict'

const db = require('../../db')
const router = module.exports = require('ozymandias').Router()

router.get('/', (req, res) => {
  const oversold = req.query.oversold === '1'
  const query = db.Product.include('grower')
  if (oversold) query.where('reserved > supply')

  query.order('name').all().then((products) => {
    res.react({
      oversold: oversold,
      products: products
    })
  }).catch(res.error)
})
