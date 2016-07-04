'use strict'

let db = require('../../../db')
let test = require('../../test')

test('DELETE /product_orders/:id is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .delete('/admin/product-orders/1')
    .expect(200)
    .end(function (e) {
      if (e) return t.end(e)
      db.ProductOrder.find(1).then(function (productOrder) {
        t.ok(productOrder == null)
        t.end()
      })
    })
  })
})

test('POST /product-orders/:id is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/product-orders/1')
    .send({quantity: 1, cost: '1.23'})
    .expect(200)
    .end(function (e, res) {
      if (e) return t.end(e)
      t.is(res.body.cost, '1.23')
      t.is(res.body.quantity, 1)
      db.ProductOrder.find(1).then(function (productOrder) {
        t.equal(productOrder.cost, '1.23')
        t.equal(productOrder.quantity, 1)
        t.end()
      })
    })
  })
})

test('POST /product-orders is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/product-orders')
    .send({quantity: 1, order_id: 1, product_id: 3})
    .expect(200)
    .end((e, res) => {
      if (e) return t.end(e)
      t.is(res.body.quantity, 1)
      t.is(res.body.order_id, 1)
      t.is(res.body.product_id, 3)
      db.ProductOrder.find(res.body.id).then((productOrder) => {
        t.is(productOrder.quantity, 1)
        t.end()
      })
    })
  })
})

test('editing an inactive product order', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/admin/product-orders/9')
    .send({quantity: 2, cost: '6'})
    .expect(200)
    .end(function (e, res) {
      if (e) return t.end(e)
      t.is(res.body.cost, '6.00')
      t.is(res.body.quantity, 2)
      db.ProductOrder.find(9).then(function (productOrder) {
        t.is(productOrder.quantity, 2)
        t.is(productOrder.cost, '6.00')
        t.end()
      })
    })
  })
})
