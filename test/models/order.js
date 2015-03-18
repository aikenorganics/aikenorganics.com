var test = require('../test')
var models = require('../../models')

test('Order reports the correct cost', function (t) {
  var order = models.Order.build()
  order.productOrders = []

  order.productOrders.push(models.ProductOrder.build({
    quantity: 2
  }))
  order.productOrders[0].product = models.Product.build({
    name: 'Peaches',
    cost: '5.75',
    supply: 15
  })

  order.productOrders.push(models.ProductOrder.build({
    quantity: 3
  }))
  order.productOrders[1].product = models.Product.build({
    name: 'Strawberries',
    cost: '2.50',
    supply: 10
  })

  t.equal(order.cost(), 19)
  t.end()
})
