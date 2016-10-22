'use strict'

const {Market} = require('../../../db')
const test = require('../../test')

test('GET /admin/market is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/market').send()
  response.assert(200)
})

test('POST /admin/market is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .post('/admin/market')
    .set('accept', 'application/json')
    .send({open: true, message: 'test'})
  response.assert(200).assert('content-type', /json/)
  const {id, message, open} = response.body.market
  t.is(id, 1)
  t.is(open, true)
  t.is(message, 'test')
  const market = yield Market.find(1)
  t.ok(market.open)
})

test('POST /admin/market is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .post('/admin/market')
    .set('accept', 'application/json')
    .send({open: false, message: 'test'})
  response.assert(200).assert('content-type', /json/)
  const {id, message, open} = response.body.market
  t.is(id, 1)
  t.is(open, false)
  t.is(message, 'test')
  const market = yield Market.find(1)
  t.ok(!market.open)
})
