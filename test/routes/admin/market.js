'use strict'

const {Market} = require('../../../db')
const test = require('../../test')

test('GET /admin/market is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/market').send()
  response.assert(200)
})

test('POST /admin/market is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client
    .post('/admin/market')
    .set('accept', 'application/json')
    .send({message: 'test'})
  response.assert(200).assert('content-type', /json/)
  const {id, message} = response.body.market
  assert.is(id, 1)
  assert.is(message, 'test')
  const market = await Market.find(1)
  assert.is(market.message, 'test')
})

test('POST /admin/market is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client
    .post('/admin/market')
    .set('accept', 'application/json')
    .send({message: 'test'})
  response.assert(200).assert('content-type', /json/)
  const {id, message} = response.body.market
  assert.is(id, 1)
  assert.is(message, 'test')
  const market = await Market.find(1)
  assert.is(market.message, 'test')
})
