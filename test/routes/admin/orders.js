var test = require('tape')
var request = require('../request')
var models = require('../../../models')

test('GET /admin/orders is a 200', function (t) {
  var agent = request().signIn('admin@example.com', function () {
    agent
    .get('/admin/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/orders/:id is a 200', function (t) {
  models.Order.findOne({}).then(function (order) {
    var agent = request().signIn('admin@example.com', function () {
      agent
      .get(`/admin/orders/${order.id}`)
      .expect(200)
      .end(t.end)
    })
  })
})

test('GET /admin/orders?product_id=:id is a 200', function (t) {
  models.Product.findOne({}).then(function (product) {
    var agent = request().signIn('admin@example.com', function () {
      agent
      .get(`/admin/orders?product_id=${product.id}`)
      .expect(200)
      .end(t.end)
    })
  })
})

test('GET /admin/orders/list is a 200', function (t) {
  var agent = request().signIn('admin@example.com', function () {
    agent
    .get('/admin/orders/list')
    .expect(200)
    .end(t.end)
  })
})
