'use strict'

const db = require('../../db')
const test = require('../test')

test('POST /cart is a 401 logged out', (t) => {
  t.request()
  .post('/cart')
  .expect(401)
  .end(t.end)
})

test('POST /cart is a 200 logged in', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/cart')
    .send({product_id: 1, quantity: 2})
    .expect(200)
    .end(t.end)
  })
})

test('GET /cart is a 200 logged in', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/cart')
    .send({product_id: 1, quantity: 2})
    .expect(200)
    .end((e) => {
      if (e) return t.end(e)
      t.agent.get('/cart')
      .expect(200)
      .end(t.end)
    })
  })
})

test('POST /cart/checkout', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/cart').send({product_id: 1, quantity: 2})
    .expect(200).end((e) => {
      if (e) return t.end(e)
      t.agent.post('/cart').send({product_id: 3, quantity: 4})
      .expect(200).end((e) => {
        if (e) return t.end(e)
        t.agent.post('/cart').send({product_id: 4, quantity: 20})
        .expect(200).end((e) => {
          if (e) return t.end(e)
          t.agent.post('/cart').send({product_id: 5, quantity: 1})
          .expect(200).end((e) => {
            if (e) return t.end(e)
            t.agent.post('/cart').send({product_id: 8, quantity: 1})
            .expect(200).end((e) => {
              t.agent.post('/cart/checkout').send({location_id: 2}).expect(200)
              .end((e) => {
                if (e) return t.end(e)
                verify()
              })
            })
          })
        })
      })
    })
  })

  function verify () {
    Promise.all([
      db.Order.find(1),
      db.ProductOrder.where({order_id: 1}).order('product_id').all(),
      db.Product.where({id: [1, 2, 3, 4]}).order('id').all()
    ]).then((results) => {
      t.is(results[0].location_id, 2)
      t.deepEqual(results[1].map((productOrder) => {
        return productOrder.slice('product_id', 'quantity')
      }), [
        {product_id: 1, quantity: 4},
        {product_id: 2, quantity: 3},
        {product_id: 3, quantity: 4},
        {product_id: 4, quantity: 14},
        {product_id: 8, quantity: 1}
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
})

test('POST /cart is a 200 for inactive products/growers', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/cart')
    .send({product_id: 6, quantity: 1})
    .expect(200)
    .end(t.end)
  })
})
