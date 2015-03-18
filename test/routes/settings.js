var test = require('../test')
var models = require('../../models')

test('/settings/account is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/settings/account')
    .expect(200)
    .end(t.end)
  })
})

test('/settings/account is a 200 as a regular user', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/settings/account')
    .expect(200)
    .end(t.end)
  })
})

test('POST /settings/account is a 302 as a regular user', function (t) {
  models.User.findAll({where: {email: 'user@example.com'}}).then(function (users) {
    t.signIn('user@example.com').then(function (agent) {
      agent
      .post('/settings/account')
      .field('first', users[0].first)
      .field('last', users[0].last)
      .field('phone', users[0].phone)
      .expect(302)
      .end(t.end)
    })
  })
})
