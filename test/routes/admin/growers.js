'use strict'

const test = require('../../test')

test('GET /admin/growers is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/growers').send()
  response.assert(200)
})

test('GET /admin/growers/orders is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/growers/orders').send()
  response.assert(200)
})

test('GET /admin/growers/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/growers/1').send()
  response.assert(200)
})

test('GET /admin/growers/:id/users is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/growers/1/users').send()
  response.assert(200)
})
