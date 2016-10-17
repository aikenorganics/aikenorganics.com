'use strict'

const {Market} = require('../../../db')
const test = require('../../test')

test('GET /admin/market is a 200', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/market').expect(200).end(t.end)
  })
})

test('POST /admin/market is a 200', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/market')
    .set('accept', 'application/json')
    .send({open: true, message: 'test'})
    .expect(200)
    .expect('content-type', /json/)
    .end((error, response) => {
      if (error) return t.end(error)
      const {id, message, open} = response.body.market
      t.is(id, 1)
      t.is(open, true)
      t.is(message, 'test')
      Market.find(1).then((market) => {
        t.ok(market.open)
        t.end()
      })
    })
  })
})

test('POST /admin/market is a 200', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/market')
    .set('accept', 'application/json')
    .send({open: false, message: 'test'})
    .expect(200)
    .expect('content-type', /json/)
    .end((error, response) => {
      if (error) return t.end(error)
      const {id, message, open} = response.body.market
      t.is(id, 1)
      t.is(open, false)
      t.is(message, 'test')
      Market.find(1).then((market) => {
        t.ok(!market.open)
        t.end()
      })
    })
  })
})
