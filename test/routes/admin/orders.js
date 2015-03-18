var test = require('../../test')
var models = require('../../../models')

test('GET /admin/orders is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/admin/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/orders/:id is a 200', function (t) {
  models.Order.findOne({}).then(function (order) {
    t.signIn('admin@example.com').then(function (agent) {
      agent
      .get(`/admin/orders/${order.id}`)
      .expect(200)
      .end(t.end)
    })
  })
})

test('GET /admin/orders?product_id=:id is a 200', function (t) {
  models.Product.findOne({}).then(function (product) {
    t.signIn('admin@example.com').then(function (agent) {
      agent
      .get(`/admin/orders?product_id=${product.id}`)
      .expect(200)
      .end(t.end)
    })
  })
})

test('GET /admin/orders?full=1 is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/admin/orders?full=1')
    .expect(200)
    .end(t.end)
  })
})
