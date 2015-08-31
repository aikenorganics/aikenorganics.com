'use strict'

let db = require('../../../db')
let test = require('../../test')

test('POST /admin/users/:id is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/users/2')
    .field('first', 'first')
    .field('last', 'last')
    .field('phone', '555-555-5555')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.transaction(function () {
        db.User.find(2).then(function (user) {
          t.is(user.first, 'first')
          t.is(user.last, 'last')
          t.is(user.phone, '555-555-5555')
          t.end()
        })
      })
    })
  })
})

test('GET /admin/users is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/users')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/users/show is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/users/1/edit')
    .expect(200)
    .expect(/is_admin/)
    .end(t.end)
  })
})

test('missing users are a 404 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/users/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /admin/users is a 401 as a regular user', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/admin/users')
    .expect(401)
    .end(t.end)
  })
})

test('GET /admin/users/show is a 401 as a regular user', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/admin/users/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /admin/users/emails is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/users/emails')
    .expect(200)
    .end(t.end)
  })
})
