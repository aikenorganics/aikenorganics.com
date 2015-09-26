'use strict'

let db = require('../../db')
let test = require('../test')

test('POST /cart is a 401 logged out', function (t) {
  t.request()
  .post('/cart')
  .expect(401)
  .end(t.end)
})

test('POST /cart is a 302 logged in', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/cart')
    .field('product_id', 1)
    .field('quantity', 2)
    .expect(302)
    .end(t.end)
  })
})

test('GET /cart is a 200 logged in', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/cart')
    .field('product_id', 1)
    .field('quantity', 2)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      agent.get('/cart')
      .expect(200)
      .end(t.end)
    })
  })
})

test('POST /cart/checkout', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/cart')
    .field('product_id', 1)
    .field('quantity', 2)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      agent.post('/cart')
      .field('product_id', 3)
      .field('quantity', 4)
      .expect(302)
      .end(function (e) {
        if (e) return t.end(e)
        agent.post('/cart')
        .field('product_id', 4)
        .field('quantity', 20)
        .expect(302)
        .end(function (e) {
          if (e) return t.end(e)
          agent
          .post('/cart/checkout')
          .field('location_id', 2)
          .expect(302)
          .end(function (e) {
            if (e) return t.end(e)
            verify()
          })
        })
      })
    })
  })

  function verify () {
    db.transaction(function () {
      Promise.all([
        db.Order.find(1),
        db.ProductOrder.where({order_id: 1}).order('product_id').all(),
        db.Product.where({id: [1, 2, 3, 4]}).order('id').all()
      ]).then(function (results) {
        t.is(results[0].location_id, 2)
        t.deepEqual(results[1].map(function (productOrder) {
          return productOrder.slice('product_id', 'quantity')
        }), [
          {product_id: 1, quantity: 4},
          {product_id: 2, quantity: 3},
          {product_id: 3, quantity: 4},
          {product_id: 4, quantity: 14}
        ])
        t.deepEqual(results[2].map(function (product) {
          return product.slice('id', 'reserved')
        }), [
          {id: 1, reserved: 4},
          {id: 2, reserved: 3},
          {id: 3, reserved: 5},
          {id: 4, reserved: 15}
        ])
        t.end()
      })
    }).catch(t.end)
  }
})

test('POST /cart is a 302 for inactive products/growers', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent
    .post('/cart')
    .field('product_id', 6)
    .field('quantity', 1)
    .expect(302)
    .end(t.end)
  })
})
