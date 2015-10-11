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
      db.transaction(function () {
        db.ProductOrder.find(1).then(function (productOrder) {
          t.ok(productOrder == null)
          t.end()
        })
      })
    })
  })
})

test('POST /product-orders/:id is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/product-orders/1')
    .field('quantity', 1)
    .field('cost', '1.23')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.transaction(function () {
        db.ProductOrder.find(1).then(function (productOrder) {
          t.equal(productOrder.cost, '1.23')
          t.equal(productOrder.quantity, 1)
          t.end()
        })
      })
    })
  })
})

test('POST /product-orders is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/product-orders')
    .field('quantity', 1)
    .field('order_id', 1)
    .field('product_id', 3)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.transaction(function () {
        db.ProductOrder.where({order_id: 1, product_id: 3}).find()
        .then(function (productOrder) {
          t.equal(productOrder.quantity, 1)
          t.end()
        })
      })
    })
  })
})
