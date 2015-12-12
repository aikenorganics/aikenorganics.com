'use strict'

let db = require('../../../db')
let test = require('../../test')

test('GET /admin/market is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/market').expect(200).end(t.end)
  })
})

test('POST /admin/market is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/market')
    .send('open=1')
    .send('return_to=/')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.Market.find(1).then(function (market) {
        t.ok(market.open)
        t.end()
      })
    })
  })
})

test('POST /admin/market is a 302', function (t) {
  t.hostname('closed.localhost')
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/market')
    .send('open=0')
    .send('return_to=/')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.Market.find(2).then(function (market) {
        t.ok(!market.open)
        t.end()
      })
    })
  })
})
