'use strict'

const {Order, Market} = require('../../db')
const test = require('../test')

// Current

test('GET /orders/current is a 401 logged out', async ({assert}) => {
  const response = await assert.client.get('/orders/current').send()
  response.assert(401)
})

test('GET /orders/current is a 200', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/orders/current').send()
  response.assert(200)
})

test('GET /orders/current with no order', async ({assert}) => {
  await assert.signIn('finn@example.com')
  const response = await assert.client.get('/orders/current').send()
  response.assert(200)
})

// Cancel

test('DELETE /orders/:id is a 401 logged out', async ({assert}) => {
  const response = await assert.client.delete('/orders/2').send()
  response.assert(401)
})

test('DELETE /orders/:id is a 401 when closed', async ({assert}) => {
  await (await Market.find(1)).update({closed: true})
  await assert.signIn('user@example.com')
  const response = await assert.client.delete('/orders/2').send()
  response.assert(401)
})

test('DELETE /orders/:id is a 200', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.delete('/orders/2').send()
  response.assert(200).assert('content-type', /json/)
  const order = await Order.find(2)
  assert.ok(order == null, 'the order was deleted')
})

test('Canceling a missing order returns a 404', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client
    .delete('/orders/123456789')
    .set('accept', 'application/json')
    .send()
  response.assert(404).assert('content-type', /json/)
})

test('Cannot cancel someone else\'s order', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client
    .delete('/orders/1')
    .set('accept', 'application/json')
    .send()
  response.assert(401).assert('content-type', /json/)
})

// Update

test('POST /orders/:id is a 401 logged out', async ({assert}) => {
  const response = await assert.client.post('/orders/2').send()
  response.assert(401)
})

test('POST /orders/:id is a 200', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.post('/orders/2').send({
    locationId: 2,
    status: 'canceled',
    notes: 'updated'
  })
  response.assert(200).assert('Content-Type', /json/)

  const {location, status, notes} = response.body.order
  assert.ok(location)
  assert.is(location.id, 2)
  assert.is(status, 'open')
  assert.is(notes, '')

  const order = await Order.find(2)
  assert.is(order.locationId, 2)
  assert.is(order.status, 'open')
  assert.is(order.notes, '')
})

test('Cannout update an order when the market is closed', async ({assert}) => {
  await (await Market.find(1)).update({closed: true})
  await assert.signIn('user@example.com')
  const response = await assert.client.post('/orders/2').send({locationId: 2})
  response.assert(401)
})

test('Cannout update someone else\'s order', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.post('/orders/1').send({locationId: 2})
  response.assert(401)
})

test('Admins can update someone else\'s order', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.post('/orders/5').send({
    locationId: 2,
    status: 'canceled',
    notes: 'updated'
  })
  response.assert(200)

  const {location, notes, status} = response.body.order
  assert.ok(location)
  assert.is(location.id, 2)
  assert.is(notes, 'updated')
  assert.is(status, 'canceled')

  const order = await Order.find(5)
  assert.is(order.locationId, 2)
  assert.is(order.status, 'canceled')
  assert.is(order.notes, 'updated')
})

test('Admins can update orders when the market is closed', async ({assert}) => {
  await (await Market.find(1)).update({closed: true})
  await assert.signIn('admin@example.com')
  const response = await assert.client.post('/orders/5').send({locationId: 2})
  response.assert(200)
})

test('Updating a missing order returns a 404', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.post('/orders/123456789').send({locationId: 2})
  response.assert(404)
})

// Previous

test('GET /orders/previous is a 401 logged out', async ({assert}) => {
  const response = await assert.client.get('/orders/previous').send()
  response.assert(401)
})

test('GET /orders/previous', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/orders/previous').send()
  response.assert(200)
})
