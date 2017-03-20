'use strict'

const {ProductOrder} = require('../../db')
const {post} = require('koa-route')

module.exports = [

  // Create
  post('/admin/product-orders', async (_) => {
    const {id} = await ProductOrder.create(_.permit(
      'orderId', 'quantity', 'productId'
    ))
    _.body = {
      productOrder: await ProductOrder.include('product').find(id)
    }
  }),

  // Update
  post('/admin/product-orders/:id', async (_, id) => {
    const productOrder = await ProductOrder.find(id)
    if (!productOrder) return _.notfound()
    await productOrder.update(_.permit('quantity', 'cost'))
    _.body = {
      productOrder: await ProductOrder.include('product').find(id)
    }
  })

]
