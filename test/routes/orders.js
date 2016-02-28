'use strict'

var db = require('../../db')
var test = require('../test')

test('GET /orders/current is a 200', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .get('/orders/current')
    .expect(200)
    .end(t.end)
  })
})

test('GET /orders/current with no order', function (t) {
  t.signIn('finn@example.com').then(() => {
    t.agent
    .get('/orders/current')
    .expect(200)
    .end(t.end)
  })
})

test('DELETE /orders/:id is a 200', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .delete('/orders/2')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (e) {
      if (e) return t.end(e)
      db.Order.find(2).then(function (order) {
        t.ok(order == null, 'the order was deleted')
        t.end()
      }).catch(t.end)
    })
  })
})

test('POST /orders/:id is a 302', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/orders/2')
    .send({location_id: 2})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (e, res) {
      if (e) return t.end(e)
      t.ok(res.body.location)
      t.is(res.body.location.id, 2)
      t.is(res.body.location_id, 2)
      db.Order.find(2).then(function (order) {
        t.is(order.location_id, 2)
        t.end()
      }).catch(t.end)
    })
  })
})

test('Cannot cancel someone else\'s order', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .delete('/orders/1')
    .expect(401)
    .expect('Content-Type', /json/)
    .end(t.end)
  })
})

test('Cannout update someone else\'s order', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/orders/1')
    .send({location_id: 2})
    .expect(401)
    .end(t.end)
  })
})

test('Canceling a missing order returns a 404', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .delete('/orders/123456789')
    .set('Accept', 'application/json')
    .expect(404)
    .expect('Content-Type', /json/)
    .end(t.end)
  })
})

test('Updating a missing order returns a 404', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/orders/123456789')
    .send({location_id: 2})
    .expect(404)
    .end(t.end)
  })
})
