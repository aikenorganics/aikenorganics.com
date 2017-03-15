'use strict'

const {Market} = require('../../../db')
const test = require('../../test')

test('GET /admin/market is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/market').send()
  response.assert(200)
})

test('POST /admin/market is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client
    .post('/admin/market')
    .set('accept', 'application/json')
    .send({message: 'test'})
  response.assert(200).assert('content-type', /json/)
  const {id, message} = response.body.market
  t.is(id, 1)
  t.is(message, 'test')
  const market = await Market.find(1)
  t.is(market.message, 'test')
})

test('POST /admin/market is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client
    .post('/admin/market')
    .set('accept', 'application/json')
    .send({message: 'test'})
  response.assert(200).assert('content-type', /json/)
  const {id, message} = response.body.market
  t.is(id, 1)
  t.is(message, 'test')
  const market = await Market.find(1)
  t.is(market.message, 'test')
})
