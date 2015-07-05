var test = require('../test')
var models = require('../../models')

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
      agent
      .post('/cart/checkout')
      .field('location_id', 1)
      .expect(302)
      .end(function (e) {
        if (e) return t.end(e)
        models.Product.findOne({
          where: {id: 1},
          transaction: t.transaction
        }).then(function (product) {
          t.equal(product.reserved, 4)
          t.end()
        })
      })
    })
  })
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
