'use strict'

let db = require('../../../db')
let test = require('../../test')

test('POST /admin/users/:id is a 302', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/users/2')
    .send('first=first')
    .send('last=last')
    .send('phone=555-555-5555')
    .expect(200)
    .end(function (e) {
      if (e) return t.end(e)
      db.User.find(2).then(function (user) {
        t.is(user.first, 'first')
        t.is(user.last, 'last')
        t.is(user.phone, '555-555-5555')
        t.end()
      })
    })
  })
})

test('GET /admin/users is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/users')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/users is a 200 as an admin with a search', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/users?search=admin')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/users/show is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/users/1/edit')
    .expect(200)
    .expect(/is_admin/)
    .end(t.end)
  })
})

test('missing users are a 404 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/users/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /admin/users is a 401 as a regular user', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/admin/users')
    .expect(401)
    .end(t.end)
  })
})

test('GET /admin/users/show is a 401 as a regular user', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/admin/users/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /admin/users/emails is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/users/emails')
    .expect(200)
    .end(t.end)
  })
})

test('Search for stop word', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/users?search=with')
    .expect(200)
    .expect(/jwitherow@example\.com/i)
    .end(t.end)
  })
})

test('Search for joanne', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/users?search=joanne')
    .expect(200)
    .expect(/jwitherow@example\.com/i)
    .end(t.end)
  })
})

test('Delete a user', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/admin/users/7/delete')
    .expect(302)
    .end((e) => {
      if (e) return t.end(e)
      db.User.find(7).then((user) => {
        t.ok(user == null)
        t.end()
      })
    })
  })
})
