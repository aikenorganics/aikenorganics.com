'use strict'

const {ProductOrder} = require('../../../db')
const test = require('../../test')

test('DELETE /product-orders/missing is a 404', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.delete('/admin/product-orders/12345').send()
  response.assert(404)
})

test('DELETE /product-orders/:id is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.delete('/admin/product-orders/1').send()
  response.assert(200)
  const productOrder = await ProductOrder.find(1)
  t.ok(productOrder == null)
})

test('POST /product-orders/missing is a 404', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.post('/admin/product-orders/12345').send()
  response.assert(404)
})

test('POST /product-orders/:id is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client
    .post('/admin/product-orders/1')
    .send({quantity: 1, cost: '1.23'})
  response.assert(200)

  const {cost, quantity} = response.body.productOrder
  t.is(cost, '1.23')
  t.is(quantity, 1)

  const productOrder = await ProductOrder.find(1)
  t.equal(productOrder.cost, '1.23')
  t.equal(productOrder.quantity, 1)
})

test('POST /product-orders is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client
    .post('/admin/product-orders')
    .send({quantity: 1, orderId: 1, productId: 3})
  response.assert(200)

  const {id, orderId, productId, quantity} = response.body.productOrder
  t.is(quantity, 1)
  t.is(orderId, 1)
  t.is(productId, 3)

  const productOrder = await ProductOrder.find(id)
  t.is(productOrder.quantity, 1)
})

test('editing an inactive product order', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client
    .post('/admin/product-orders/9')
    .send({quantity: 2, cost: '6'})
  response.assert(200)

  const {cost, quantity} = response.body.productOrder
  t.is(cost, '6.00')
  t.is(quantity, 2)

  const productOrder = await ProductOrder.find(9)
  t.is(productOrder.quantity, 2)
  t.is(productOrder.cost, '6.00')
})
