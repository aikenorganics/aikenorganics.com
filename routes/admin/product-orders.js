'use strict'

const db = require('../../db')
const router = module.exports = require('ozymandias').Router()

// Find the ProductOrder
router.find('product_order_id', 'productOrder', () => db.ProductOrder)

// Create
router.post('/', (req, res) => {
  db.ProductOrder.create(req.permit('order_id', 'quantity', 'product_id'))
  .then(({id}) => (
    db.ProductOrder.include('product').find(id).then((productOrder) => {
      res.json(productOrder)
    })
  )).catch(res.error)
})

// Delete
router.delete('/:product_order_id', (req, res) => {
  req.productOrder.destroy().then(() => {
    res.json({})
  }).catch(res.error)
})

// Update
router.post('/:product_order_id', (req, res) => {
  req.productOrder.update(req.permit('quantity', 'cost')).then(() => {
    return db.ProductOrder.include('product').find(req.productOrder.id).then((productOrder) => {
      res.json(productOrder)
    })
  }).catch(res.error)
})
