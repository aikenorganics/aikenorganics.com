'use strict'

const db = require('../../db')
const test = require('../test')

test('/settings is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/settings')
    .expect(200)
    .end(t.end)
  })
})

test('/settings is a 200 as a regular user', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/settings')
    .expect(200)
    .end(t.end)
  })
})

test('POST /settings is a 200 as a regular user', (t) => {
  db.User.where({email: 'user@example.com'}).find().then((user) => {
    t.signIn('user@example.com').then(() => {
      t.agent.post('/settings')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        first: user.first,
        last: user.last,
        phone: user.phone
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(t.end)
    })
  })
})
