'use strict'

const test = require('../../test')

test('GET /admin/growers is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.get('/admin/growers')
  .expect(200)
  .end(t.end)
})

test('GET /admin/growers/orders is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.get('/admin/growers/orders')
  .expect(200)
  .end(t.end)
})

test('GET /admin/growers/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.get('/admin/growers/1')
  .expect(200)
  .end(t.end)
})

test('GET /admin/growers/:id/users is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.get('/admin/growers/1/users')
  .expect(200)
  .end(t.end)
})
