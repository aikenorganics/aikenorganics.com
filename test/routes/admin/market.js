var test = require('../../test')
var models = require('../../../models')

test('POST /admin/market is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/market')
    .field('open', '1')
    .field('return_to', '/')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.Market.findOne({
        where: {id: 1},
        transaction: t.transaction
      }).then(function (market) {
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
    .field('open', '0')
    .field('return_to', '/')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.Market.findOne({
        where: {id: 2},
        transaction: t.transaction
      }).then(function (market) {
        t.ok(!market.open)
        t.end()
      })
    })
  })
})
