'use strict'

let db = require('../../../db')
let test = require('../../test')

test('POST /product_orders/:id/remove is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/product-orders/1/remove')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.ProductOrder.find(1).then(function (productOrder) {
        t.ok(productOrder == null)
        t.end()
      })
    })
  })
})

test('POST /product-orders/:id is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/product-orders/1')
    .send('quantity=1')
    .send('cost=1.23')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.ProductOrder.find(1).then(function (productOrder) {
        t.equal(productOrder.cost, '1.23')
        t.equal(productOrder.quantity, 1)
        t.end()
      })
    })
  })
})

test('POST /product-orders is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/product-orders')
    .send('quantity=1')
    .send('order_id=1')
    .send('product_id=3')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.ProductOrder.where({order_id: 1, product_id: 3}).find()
      .then(function (productOrder) {
        t.equal(productOrder.quantity, 1)
        t.end()
      })
    })
  })
})

test('editing an inactive product order', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/admin/product-orders/9')
    .send('quantity=2')
    .send('cost=6')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.ProductOrder.find(9).then(function (productOrder) {
        t.is(productOrder.quantity, 2)
        t.is(productOrder.cost, '6.00')
        t.end()
      })
    })
  })
})
