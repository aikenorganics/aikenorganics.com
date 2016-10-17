'use strict'

const {Order, Market} = require('../../db')
const test = require('../test')

// Current

test('GET /orders/current is a 401 logged out', function *(t) {
  const response = yield t.client.get('/orders/current').send()
  response.expect(401)
})

test('GET /orders/current is a 200', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/orders/current').send()
  response.expect(200)
})

test('GET /orders/current with no order', function *(t) {
  yield t.signIn('finn@example.com')
  const response = yield t.client.get('/orders/current').send()
  response.expect(200)
})

// Cancel

test('DELETE /orders/:id is a 401 logged out', function *(t) {
  const response = yield t.client.delete('/orders/2').send()
  response.expect(401)
})

test('DELETE /orders/:id is a 401 when closed', function *(t) {
  const market = yield Market.find(1)
  yield market.update({open: false})
  yield t.signIn('user@example.com')
  const response = yield t.client.delete('/orders/2').send()
  response.expect(401)
})

test('DELETE /orders/:id is a 200', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.delete('/orders/2').send()
  response.expect(200).expect('content-type', /json/)
  const order = yield Order.find(2)
  t.ok(order == null, 'the order was deleted')
})

test('Canceling a missing order returns a 404', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client
    .delete('/orders/123456789')
    .set('accept', 'application/json')
    .send()
  response.expect(404).expect('content-type', /json/)
})

test('Cannot cancel someone else\'s order', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client
    .delete('/orders/1')
    .set('accept', 'application/json')
    .send()
  response.expect(401).expect('content-type', /json/)
})

// Update

test('POST /orders/:id is a 401 logged out', function *(t) {
  const response = yield t.client.post('/orders/2').send()
  response.expect(401)
})

test('POST /orders/:id is a 200', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/orders/2').send({
    locationId: 2,
    status: 'canceled',
    notes: 'updated'
  })
  response.expect(200).expect('Content-Type', /json/)

  const {location, status, notes} = response.body.order
  t.ok(location)
  t.is(location.id, 2)
  t.is(status, 'open')
  t.is(notes, '')

  const order = yield Order.find(2)
  t.is(order.locationId, 2)
  t.is(order.status, 'open')
  t.is(order.notes, '')
})

test('Cannout update an order when the market is closed', function *(t) {
  const market = yield Market.find(1)
  yield market.update({open: false})
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/orders/2').send({locationId: 2})
  response.expect(401)
})

test('Cannout update someone else\'s order', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/orders/1').send({locationId: 2})
  response.expect(401)
})

test('Admins can update someone else\'s order', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/orders/5').send({
    locationId: 2,
    status: 'canceled',
    notes: 'updated'
  })
  response.expect(200)

  const {location, notes, status} = response.body.order
  t.ok(location)
  t.is(location.id, 2)
  t.is(notes, 'updated')
  t.is(status, 'canceled')

  const order = yield Order.find(5)
  t.is(order.locationId, 2)
  t.is(order.status, 'canceled')
  t.is(order.notes, 'updated')
})

test('Admins can update orders when the market is closed', function *(t) {
  const market = yield Market.find(1)
  yield market.update({open: false})
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/orders/5').send({locationId: 2})
  response.expect(200)
})

test('Updating a missing order returns a 404', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/orders/123456789').send({locationId: 2})
  response.expect(404)
})

// Previous

test('GET /orders/previous is a 401 logged out', function *(t) {
  const response = yield t.client.get('/orders/previous').send()
  response.expect(401)
})

test('GET /orders/previous', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/orders/previous').send()
  response.expect(200)
})
