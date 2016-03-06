'use strict'

const db = require('../../db')
const test = require('../test')

test('/settings/account is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/settings/account')
    .expect(200)
    .end(t.end)
  })
})

test('/settings/account is a 200 as a regular user', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/settings/account')
    .expect(200)
    .end(t.end)
  })
})

test('POST /settings/account is a 302 as a regular user', (t) => {
  db.User.where({email: 'user@example.com'}).find().then((user) => {
    t.signIn('user@example.com').then(() => {
      t.agent.post('/settings/account')
      .send(`first=${user.first}`)
      .send(`last=${user.last}`)
      .send(`phone=${user.phone}`)
      .expect(302)
      .end(t.end)
    })
  })
})
