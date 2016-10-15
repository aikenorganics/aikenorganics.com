'use strict'

const {ProductOrder} = require('../../db')
const {del, post} = require('koa-route')

module.exports = [

  // Create
  post('/admin/product-orders', function *() {
    const {id} = yield ProductOrder.create(this.permit(
      'orderId', 'quantity', 'productId'
    ))
    this.body = {
      productOrder: yield ProductOrder.include('product').find(id)
    }
  }),

  // Delete
  del('/admin/product-orders/:id', function *(id) {
    const productOrder = yield ProductOrder.find(id)
    if (!productOrder) return this.notfound()
    yield productOrder.destroy()
    this.body = {}
  }),

  // Update
  post('/admin/product-orders/:id', function *(id) {
    const productOrder = yield ProductOrder.find(id)
    if (!productOrder) return this.notfound()
    yield productOrder.update(this.permit('quantity', 'cost'))
    this.body = {
      productOrder: yield ProductOrder.include('product').find(id)
    }
  })

]
