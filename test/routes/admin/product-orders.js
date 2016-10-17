'use strict'

const db = require('../../../db')
const test = require('../../test')

test('DELETE /product-orders/missing is a 404', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.delete('/admin/product-orders/12345').expect(404).end(t.end)
  })
})

test('DELETE /product-orders/:id is a 200', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .delete('/admin/product-orders/1')
    .expect(200)
    .end((error) => {
      if (error) return t.end(error)
      db.ProductOrder.find(1).then((productOrder) => {
        t.ok(productOrder == null)
        t.end()
      })
    })
  })
})

test('POST /product-orders/missing is a 404', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/admin/product-orders/12345').expect(404).end(t.end)
  })
})

test('POST /product-orders/:id is a 200', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/product-orders/1')
    .send({quantity: 1, cost: '1.23'})
    .expect(200)
    .end((error, response) => {
      if (error) return t.end(error)
      const {cost, quantity} = response.body.productOrder
      t.is(cost, '1.23')
      t.is(quantity, 1)
      db.ProductOrder.find(1).then((productOrder) => {
        t.equal(productOrder.cost, '1.23')
        t.equal(productOrder.quantity, 1)
        t.end()
      })
    })
  })
})

test('POST /product-orders is a 200', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/product-orders')
    .send({quantity: 1, orderId: 1, productId: 3})
    .expect(200)
    .end((error, response) => {
      if (error) return t.end(error)
      const {id, orderId, productId, quantity} = response.body.productOrder
      t.is(quantity, 1)
      t.is(orderId, 1)
      t.is(productId, 3)
      db.ProductOrder.find(id).then((productOrder) => {
        t.is(productOrder.quantity, 1)
        t.end()
      })
    })
  })
})

test('editing an inactive product order', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/admin/product-orders/9')
    .send({quantity: 2, cost: '6'})
    .expect(200)
    .end((error, response) => {
      if (error) return t.end(error)
      const {cost, quantity} = response.body.productOrder
      t.is(cost, '6.00')
      t.is(quantity, 2)
      db.ProductOrder.find(9).then((productOrder) => {
        t.is(productOrder.quantity, 2)
        t.is(productOrder.cost, '6.00')
        t.end()
      })
    })
  })
})
