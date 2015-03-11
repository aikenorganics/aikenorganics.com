var test = require('tape')
var request = require('./request')
var models = require('../../models')

test('POST /cart is a 401 logged out', function (t) {
  request()
  .post('/cart')
  .expect(401)
  .end(t.end)
})

test('POST /cart is a 200 logged in', function (t) {
  models.Product.findAll({limit: 1}).then(function (products) {
    var agent = request().signIn('admin@example.com', function (e) {
      agent
      .post('/cart')
      .field('product_id', products[0].id)
      .field('quantity', 2)
      .end(t.end)
    })
  })
})

test('GET /cart is a 200 logged in', function (t) {
  models.Product.findAll({limit: 1}).then(function (products) {
    var agent = request().signIn('admin@example.com', function (e) {
      agent
      .post('/cart')
      .field('product_id', products[0].id)
      .field('quantity', 2)
      .end(function (e) {
        if (e) return t.end(e)
        agent.get('/cart')
        .expect(200)
        .end(t.end)
      })
    })
  })
})
