'use strict'

const db = require('../../../db')
const test = require('../../test')

test('GET /admin/market is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/market').expect(200).end(t.end)
  })
})

test('POST /admin/market is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/market')
    .send({open: true, message: 'test'})
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error, res) => {
      if (error) return t.end(error)
      const {id, message, open} = res.body.market
      t.is(id, 1)
      t.is(open, true)
      t.is(message, 'test')
      db.Market.find(1).then((market) => {
        t.ok(market.open)
        t.end()
      })
    })
  })
})

test('POST /admin/market is a 200', (t) => {
  t.hostname('closed.localhost')
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/market')
    .send({open: false, message: 'test'})
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error, res) => {
      if (error) return t.end(error)
      const {id, message, open} = res.body.market
      t.is(id, 2)
      t.is(open, false)
      t.is(message, 'test')
      db.Market.find(2).then((market) => {
        t.ok(!market.open)
        t.end()
      })
    })
  })
})
