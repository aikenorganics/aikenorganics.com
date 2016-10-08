'use strict'

const db = require('../../db')
const json = require('../../json/admin/product-orders')
const router = module.exports = require('ozymandias').Router()

// Find the ProductOrder
router.find('productOrder', () => db.ProductOrder)

// Create
router.post('/', (request, response) => {
  db.ProductOrder.create(request.permit('orderId', 'quantity', 'productId'))
  .then(({id}) => (
    db.ProductOrder.include('product').find(id).then((productOrder) => {
      response.json(json.create, {productOrder})
    })
  )).catch(response.error)
})

// Delete
router.delete('/:productOrderId', (request, response) => {
  request.productOrder.destroy().then(() => {
    response.json({})
  }).catch(response.error)
})

// Update
router.post('/:productOrderId', (request, response) => {
  request.productOrder.update(request.permit('quantity', 'cost')).then(() => {
    return db.ProductOrder.include('product').find(request.productOrder.id).then((productOrder) => {
      response.json(json.update)
    })
  }).catch(response.error)
})
