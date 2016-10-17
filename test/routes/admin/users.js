'use strict'

const {User} = require('../../../db')
const test = require('../../test')

test('POST /admin/users/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .post('/admin/users/2')
    .send({
      first: 'first',
      last: 'last',
      phone: '555-555-5555'
    })
  response.expect(200)

  const {first, last, phone} = response.body.user
  t.is(first, 'first')
  t.is(last, 'last')
  t.is(phone, '555-555-5555')

  const user = yield User.find(2)
  t.is(user.first, 'first')
  t.is(user.last, 'last')
  t.is(user.phone, '555-555-5555')
})

test('GET /admin/users is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/users').send()
  response.expect(200)
})

test('GET /admin/users is a 200 as an admin with a search', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/users?search=admin').send()
  response.expect(200)
})

test('GET /admin/users/show is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/users/1/edit').send()
  response.expect(200).expect(/isAdmin/)
})

test('missing users are a 404 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/users/123456789').send()
  response.expect(404)
})

test('GET /admin/users is a 401 as a regular user', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/admin/users').send()
  response.expect(401)
})

test('GET /admin/users/show is a 401 as a regular user', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/admin/users/1/edit').send()
  response.expect(401)
})

test('GET /admin/users/emails is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/users/emails').send()
  response.expect(200)
})

test('Search for stop word', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/users?search=with').send()
  response.expect(200).expect(/jwitherow@example\.com/i)
})

test('Search for joanne', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/users?search=joanne').send()
  response.expect(200).expect(/jwitherow@example\.com/i)
})

test('Delete a user', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.delete('/admin/users/7').send()
  response.expect(200)
  const user = yield User.find(7)
  t.ok(user == null)
})

test('/admin/users/new is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/users/new').send()
  response.expect(200)
})

test('POST /admin/users is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .post('/admin/users')
    .send({
      email: 'new@example.com',
      first: 'first',
      last: 'last',
      phone: '555-555-5555'
    })
  response.expect(200)
  const user = yield User.where({email: 'new@example.com'}).find()
  t.is(user.password, null)
  t.is(user.email, 'new@example.com')
  t.is(user.first, 'first')
  t.is(user.last, 'last')
  t.is(user.phone, '555-555-5555')
})

test('return page in JSON', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .get('/admin/users')
    .set('accept', 'application/json')
    .send()
  response.expect(200)
  t.is(response.body.page, 1)
})
