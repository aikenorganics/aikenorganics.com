'use strict'

const test = require('../../test')

test('GET /admin/orders is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/orders/:id is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/orders/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/orders?product_id=:id is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/orders?product_id=1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/orders?location_id=:id is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/orders?location_id=1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/orders?full=1 is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/orders?full=1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/orders?status=complete is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/orders?status=complete&full=1')
    .expect(200)
    .end(t.end)
  })
})
