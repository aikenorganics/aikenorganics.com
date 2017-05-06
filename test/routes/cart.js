'use strict'

const {Order, Product, ProductOrder} = require('../../db')
const test = require('../test')

test('GET /cart is a 401 logged out', async ({assert, client}) => {
  const response = await client.get('/cart').send()
  response.assert(401)
})

test('GET /cart is a 200 logged in', async ({assert, client}) => {
  await assert.signIn('admin@example.com')
  let response = await client
    .post('/cart')
    .send({productId: 1, quantity: 2})
  response.assert(200)

  response = await client.get('/cart').send()
  response.assert(200)
})

test('POST /cart is a 401 logged out', async ({assert, client}) => {
  const response = await client.post('/cart').send()
  response.assert(401)
})

test('POST /cart is a 200 logged in', async ({assert, client}) => {
  await assert.signIn('admin@example.com')
  const response = await client
    .post('/cart')
    .send({productId: 1, quantity: 2})
  response.assert(200)
})

test('POST /cart/checkout', async ({assert, client}) => {
  await assert.signIn('admin@example.com')

  let response
  response = await client.post('/cart').send({productId: 1, quantity: 2})
  response.assert(200)

  response = await client.post('/cart').send({productId: 3, quantity: 4})
  response.assert(200)

  response = await client.post('/cart').send({productId: 4, quantity: 20})
  response.assert(200)

  response = await client.post('/cart').send({productId: 5, quantity: 1})
  response.assert(200)

  response = await client.post('/cart').send({productId: 8, quantity: 1})
  response.assert(200)

  response = await client.post('/cart/checkout').send({locationId: 2})
  response.assert(200)

  const order = await Order.find(1)
  const productOrders = await ProductOrder.where({orderId: 1}).order('productId').all()
  const products = await Product.where({id: [1, 2, 3, 4]}).order('id').all()

  assert.is(order.locationId, 2)

  assert.deepEqual(productOrders.map((productOrder) => (
    productOrder.slice('productId', 'quantity')
  )), [
    {productId: 1, quantity: 4},
    {productId: 2, quantity: 3},
    {productId: 3, quantity: 4},
    {productId: 4, quantity: 14},
    {productId: 8, quantity: 1}
  ])

  assert.deepEqual(products.map((product) => product.slice('id', 'reserved')), [
    {id: 1, reserved: 4},
    {id: 2, reserved: 3},
    {id: 3, reserved: 5},
    {id: 4, reserved: 15}
  ])
})

test('POST /cart is a 200 for inactive products/growers', async ({assert, client}) => {
  await assert.signIn('user@example.com')
  const response = await client
    .post('/cart')
    .send({productId: 6, quantity: 1})
  response.assert(200)
})
