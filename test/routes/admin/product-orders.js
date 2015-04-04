var test = require('../../test')
var models = require('../../../models')

test('POST /product_orders/:id/remove is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/product-orders/1/remove')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.ProductOrder.findOne({
        where: {id: 1},
        transaction: t.transaction
      }).then(function (productOrder) {
        t.ok(productOrder == null)
        t.end()
      })
    })
  })
})

test('POST /product-orders/:id is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/product-orders/1')
    .field('quantity', 1)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.ProductOrder.findOne({
        where: {id: 1},
        transaction: t.transaction
      }).then(function (productOrder) {
        t.equal(productOrder.quantity, 1)
        t.end()
      })
    })
  })
})
