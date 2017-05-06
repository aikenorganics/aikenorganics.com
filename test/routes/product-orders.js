'use strict'

const {Market, ProductOrder} = require('../../db')
const test = require('../test')

test('DELETE /product-orders/missing is a 404', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.delete('/product-orders/12345').send()
  response.assert(404)
})

test('DELETE /product-orders/:id is a 200', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.delete('/product-orders/1').send()
  response.assert(200)
  const productOrder = await ProductOrder.find(1)
  assert.ok(productOrder == null)
})

test('DELETE /product-orders/:id is a 200 for your own order', async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.delete('/product-orders/3').send()
  response.assert(200)
  const productOrder = await ProductOrder.find(3)
  assert.ok(productOrder == null)
})

test(`DELETE /product-orders/:id is a 404 for someone else's order`, async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.delete('/product-orders/1').send()
  response.assert(404)
  const productOrder = await ProductOrder.find(1)
  assert.ok(productOrder != null)
})

test(`DELETE /product-orders/:id admin can delete from someone else's order`, async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.delete('/product-orders/3').send()
  response.assert(200)
  const productOrder = await ProductOrder.find(3)
  assert.ok(productOrder == null)
})

test(`DELETE /product-orders/:id is a 401 when signed out`, async ({assert, client}) => {
  const response = await client.delete('/product-orders/3').send()
  response.assert(401)
  const productOrder = await ProductOrder.find(3)
  assert.ok(productOrder != null)
})

test('DELETE /product-orders/:id admin can delete when market is closed', async ({assert, client}) => {
  await (await Market.find(1)).update({closed: true})
  await client.signIn('admin@example.com')
  const response = await client.delete('/product-orders/3').send()
  response.assert(200)
  const productOrder = await ProductOrder.find(3)
  assert.ok(productOrder == null)
})

test('DELETE /product-orders/:id regular user cannot delete when market is closed', async ({assert, client}) => {
  await (await Market.find(1)).update({closed: true})
  await client.signIn('user@example.com')
  const response = await client.delete('/product-orders/3').send()
  response.assert(401)
  const productOrder = await ProductOrder.find(3)
  assert.ok(productOrder != null)
})
