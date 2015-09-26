'use strict'

let db = require('../../db')
let test = require('../test')

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
  db.User.where({email: 'user@example.com'}).find().then(function (user) {
    t.signIn('user@example.com').then(function (agent) {
      agent.post('/settings/account')
      .field('first', user.first)
      .field('last', user.last)
      .field('phone', user.phone)
      .expect(302)
      .end(t.end)
    })
  })
})
