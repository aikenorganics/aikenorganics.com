var test = require('../test')
var models = require('../../models')

test('ProductOrder reports the correct cost', function (t) {
  var productOrder = models.ProductOrder.build({
    quantity: 2
  })
  productOrder.product = models.Product.build({
    name: 'Peaches',
    cost: '5.75',
    supply: 15
  })
  t.equal(productOrder.cost(), 11.50)
  t.end()
})
