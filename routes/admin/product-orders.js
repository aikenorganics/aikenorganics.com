'use strict'

const db = require('../../db')
const json = require('../../json/admin/product-orders')
const router = module.exports = require('ozymandias').Router()

// Find the ProductOrder
router.find('productOrder', () => db.ProductOrder)

// Create
router.post('/', (req, res) => {
  db.ProductOrder.create(req.permit('orderId', 'quantity', 'productId'))
  .then(({id}) => (
    db.ProductOrder.include('product').find(id).then((productOrder) => {
      res.json(json.create, {productOrder})
    })
  )).catch(res.error)
})

// Delete
router.delete('/:productOrderId', (req, res) => {
  req.productOrder.destroy().then(() => {
    res.json({})
  }).catch(res.error)
})

// Update
router.post('/:productOrderId', (req, res) => {
  req.productOrder.update(req.permit('quantity', 'cost')).then(() => {
    return db.ProductOrder.include('product').find(req.productOrder.id).then((productOrder) => {
      res.json(json.update)
    })
  }).catch(res.error)
})
