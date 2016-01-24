'use strict'

let db = require('../../../db')
let test = require('../../test')

test('GET /admin/market is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/market').expect(200).end(t.end)
  })
})

test('POST /admin/market is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/market')
    .send({open: true, message: 'test'})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (e, res) {
      if (e) return t.end(e)
      t.is(typeof res.body.id, 'number')
      t.is(res.body.open, true)
      t.is(res.body.message, 'test')
      db.Market.find(1).then(function (market) {
        t.ok(market.open)
        t.end()
      })
    })
  })
})

test('POST /admin/market is a 200', function (t) {
  t.hostname('closed.localhost')
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/market')
    .send({open: false, message: 'test'})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (e, res) {
      if (e) return t.end(e)
      t.is(typeof res.body.id, 'number')
      t.is(res.body.open, false)
      t.is(res.body.message, 'test')
      db.Market.find(2).then(function (market) {
        t.ok(!market.open)
        t.end()
      })
    })
  })
})
