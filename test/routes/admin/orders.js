'use strict'

let db = require('../../../db')
let test = require('../../test')

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
    .get(`/admin/orders?product_id=1`)
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/orders?location_id=:id is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get(`/admin/orders?location_id=1`)
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

test('GET /admin/oders?status=complete is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/orders?status=complete&full=1')
    .expect(200)
    .end(t.end)
  })
})

test('POST /admin/orders/:id is a 302', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/orders/1')
    .send('notes=test')
    .send('status=complete')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.Order.find(1).then(function (order) {
        t.is(order.status, 'complete')
        t.is(order.notes, 'test')
        t.end()
      }).catch(t.end)
    })
  })
})
