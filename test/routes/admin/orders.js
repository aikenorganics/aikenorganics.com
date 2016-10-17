'use strict'

const test = require('../../test')

test('GET /admin/orders is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/orders').send()
  response.expect(200)
})

test('GET /admin/orders/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/orders/1').send()
  response.expect(200)
})

test('GET /admin/orders?productId=:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/orders?productId=1').send()
  response.expect(200)
})

test('GET /admin/orders?locationId=:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/orders?locationId=1').send()
  response.expect(200)
})

test('GET /admin/orders?full=1 is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/orders?full=1').send()
  response.expect(200)
})

test('GET /admin/orders?status=complete is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/orders?status=complete&full=1').send()
  response.expect(200)
})

test('Download a CSV', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .get('/admin/orders?status=complete&csv=1')
    .send()
  response
    .expect(200)
    .expect('content-type', /csv/)
    .expect('id,name,email,member,location,delivery\n3,Regular User,user@example.com,"",Aiken Organics,""\n')
})

test('Download a CSV with a delivery', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .get('/admin/orders?locationId=delivery&csv=1')
    .send()
  response
    .expect(200)
    .expect('content-type', /csv/)
    .expect('id,name,email,member,location,delivery\n1,Admin User,admin@example.com,"","123 Street Drive, Townville SC 55555",✓\n')
})
