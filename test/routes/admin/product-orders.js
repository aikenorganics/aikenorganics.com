'use strict'

const {ProductOrder} = require('../../../db')
const test = require('../../test')

test('POST /product-orders/missing is a 404', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.post('/admin/product-orders/12345').send()
  response.assert(404)
})

test('POST /product-orders/:id is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client
    .post('/admin/product-orders/1')
    .send({quantity: 1, cost: '1.23'})
  response.assert(200)

  const {cost, quantity} = response.body.productOrder
  assert.is(cost, '1.23')
  assert.is(quantity, 1)

  const productOrder = await ProductOrder.find(1)
  assert.equal(productOrder.cost, '1.23')
  assert.equal(productOrder.quantity, 1)
})

test('POST /product-orders is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client
    .post('/admin/product-orders')
    .send({quantity: 1, orderId: 1, productId: 3})
  response.assert(200)

  const {id, orderId, productId, quantity} = response.body.productOrder
  assert.is(quantity, 1)
  assert.is(orderId, 1)
  assert.is(productId, 3)

  const productOrder = await ProductOrder.find(id)
  assert.is(productOrder.quantity, 1)
})

test('editing an inactive product order', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client
    .post('/admin/product-orders/9')
    .send({quantity: 2, cost: '6'})
  response.assert(200)

  const {cost, quantity} = response.body.productOrder
  assert.is(cost, '6.00')
  assert.is(quantity, 2)

  const productOrder = await ProductOrder.find(9)
  assert.is(productOrder.quantity, 2)
  assert.is(productOrder.cost, '6.00')
})
