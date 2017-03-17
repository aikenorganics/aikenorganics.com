'use strict'

const {Order, Market} = require('../../db')
const test = require('../test')

// Current

test('GET /orders/current is a 401 logged out', async (t) => {
  const response = await t.client.get('/orders/current').send()
  response.assert(401)
})

test('GET /orders/current is a 200', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client.get('/orders/current').send()
  response.assert(200)
})

test('GET /orders/current with no order', async (t) => {
  await t.signIn('finn@example.com')
  const response = await t.client.get('/orders/current').send()
  response.assert(200)
})

// Cancel

test('DELETE /orders/:id is a 401 logged out', async (t) => {
  const response = await t.client.delete('/orders/2').send()
  response.assert(401)
})

test('DELETE /orders/:id is a 401 when closed', async (t) => {
  const {isOpenAt} = Market.prototype
  try {
    Market.prototype.isOpenAt = () => false
    await t.signIn('user@example.com')
    const response = await t.client.delete('/orders/2').send()
    response.assert(401)
  } finally {
    Market.prototype.isOpenAt = isOpenAt
  }
})

test('DELETE /orders/:id is a 200', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client.delete('/orders/2').send()
  response.assert(200).assert('content-type', /json/)
  const order = await Order.find(2)
  t.ok(order == null, 'the order was deleted')
})

test('Canceling a missing order returns a 404', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client
    .delete('/orders/123456789')
    .set('accept', 'application/json')
    .send()
  response.assert(404).assert('content-type', /json/)
})

test('Cannot cancel someone else\'s order', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client
    .delete('/orders/1')
    .set('accept', 'application/json')
    .send()
  response.assert(401).assert('content-type', /json/)
})

// Update

test('POST /orders/:id is a 401 logged out', async (t) => {
  const response = await t.client.post('/orders/2').send()
  response.assert(401)
})

test('POST /orders/:id is a 200', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client.post('/orders/2').send({
    locationId: 2,
    status: 'canceled',
    notes: 'updated'
  })
  response.assert(200).assert('Content-Type', /json/)

  const {location, status, notes} = response.body.order
  t.ok(location)
  t.is(location.id, 2)
  t.is(status, 'open')
  t.is(notes, '')

  const order = await Order.find(2)
  t.is(order.locationId, 2)
  t.is(order.status, 'open')
  t.is(order.notes, '')
})

test('Cannout update an order when the market is closed', async (t) => {
  const {isOpenAt} = Market.prototype
  try {
    Market.prototype.isOpenAt = () => false
    await t.signIn('user@example.com')
    const response = await t.client.post('/orders/2').send({locationId: 2})
    response.assert(401)
  } finally {
    Market.prototype.isOpenAt = isOpenAt
  }
})

test('Cannout update someone else\'s order', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client.post('/orders/1').send({locationId: 2})
  response.assert(401)
})

test('Admins can update someone else\'s order', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.post('/orders/5').send({
    locationId: 2,
    status: 'canceled',
    notes: 'updated'
  })
  response.assert(200)

  const {location, notes, status} = response.body.order
  t.ok(location)
  t.is(location.id, 2)
  t.is(notes, 'updated')
  t.is(status, 'canceled')

  const order = await Order.find(5)
  t.is(order.locationId, 2)
  t.is(order.status, 'canceled')
  t.is(order.notes, 'updated')
})

test('Admins can update orders when the market is closed', async (t) => {
  const {isOpenAt} = Market.prototype
  try {
    Market.prototype.isOpenAt = () => false
    await t.signIn('admin@example.com')
    const response = await t.client.post('/orders/5').send({locationId: 2})
    response.assert(200)
  } finally {
    Market.prototype.isOpenAt = isOpenAt
  }
})

test('Updating a missing order returns a 404', async (t) => {
  await t.signIn('user@example.com')
  const response = await t.client.post('/orders/123456789').send({locationId: 2})
  response.assert(404)
})

// Previous

test('GET /orders/previous is a 401 logged out', async (t) => {
  const response = await t.client.get('/orders/previous').send()
  response.assert(401)
})

test('GET /orders/previous', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/orders/previous').send()
  response.assert(200)
})
