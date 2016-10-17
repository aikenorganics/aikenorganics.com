'use strict'

const {Order, Product, ProductOrder} = require('../../db')
const test = require('../test')

test('GET /cart is a 401 logged out', function *(t) {
  t.agent.get('/cart').expect(401).end(t.end)
})

test('GET /cart is a 200 logged in', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/cart')
    .send({productId: 1, quantity: 2})
    .expect(200)
    .end((error) => {
      if (error) return t.end(error)
      t.agent.get('/cart')
      .expect(200)
      .end(t.end)
    })
  })
})

test('POST /cart is a 401 logged out', function *(t) {
  t.agent.post('/cart').expect(401).end(t.end)
})

test('POST /cart is a 200 logged in', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/cart')
    .send({productId: 1, quantity: 2})
    .expect(200)
    .end(t.end)
  })
})

test('POST /cart/checkout', function *(t) {
  const verify = () => {
    Promise.all([
      Order.find(1),
      ProductOrder.where({orderId: 1}).order('productId').all(),
      Product.where({id: [1, 2, 3, 4]}).order('id').all()
    ]).then((results) => {
      t.is(results[0].locationId, 2)
      t.deepEqual(results[1].map((productOrder) => {
        return productOrder.slice('productId', 'quantity')
      }), [
        {productId: 1, quantity: 4},
        {productId: 2, quantity: 3},
        {productId: 3, quantity: 4},
        {productId: 4, quantity: 14},
        {productId: 8, quantity: 1}
      ])
      t.deepEqual(results[2].map((product) => {
        return product.slice('id', 'reserved')
      }), [
        {id: 1, reserved: 4},
        {id: 2, reserved: 3},
        {id: 3, reserved: 5},
        {id: 4, reserved: 15}
      ])
      t.end()
    }).catch(t.end)
  }

  t.signIn('admin@example.com').then(() => {
    t.agent.post('/cart').send({productId: 1, quantity: 2})
    .expect(200).end((error) => {
      if (error) return t.end(error)
      t.agent.post('/cart').send({productId: 3, quantity: 4})
      .expect(200).end((error) => {
        if (error) return t.end(error)
        t.agent.post('/cart').send({productId: 4, quantity: 20})
        .expect(200).end((error) => {
          if (error) return t.end(error)
          t.agent.post('/cart').send({productId: 5, quantity: 1})
          .expect(200).end((error) => {
            if (error) return t.end(error)
            t.agent.post('/cart').send({productId: 8, quantity: 1})
            .expect(200).end((error) => {
              if (error) return t.end(error)
              t.agent.post('/cart/checkout').send({locationId: 2}).expect(200)
              .end((error) => {
                if (error) return t.end(error)
                verify()
              })
            })
          })
        })
      })
    })
  })
})

test('POST /cart is a 200 for inactive products/growers', function *(t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/cart')
    .send({productId: 6, quantity: 1})
    .expect(200)
    .end(t.end)
  })
})
