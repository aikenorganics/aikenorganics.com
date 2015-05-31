var test = require('../test')
var models = require('../../models')

test('ProductOrder reports the correct cost', function (t) {
  var productOrder = models.ProductOrder.build({
    cost: '5.75',
    quantity: 2
  })
  t.equal(productOrder.total(), 11.50)
  t.end()
})

test('Cannot insert product order for inactive products', function (t) {
  models.ProductOrder.create({
    order_id: 2,
    product_id: 7,
    quantity: 1
  }, {transaction: t.transaction}).then(function () {
    t.end('Product order inserted for inactive product')
  }).catch(function (e) {
    t.end()
  })
})

test('Cannot insert product order for inactive grower', function (t) {
  models.ProductOrder.create({
    order_id: 2,
    product_id: 6,
    quantity: 1
  }, {transaction: t.transaction}).then(function () {
    t.end('Product order inserted for inactive grower')
  }).catch(function (e) {
    t.end()
  })
})

test('Cannot insert product order with none available', function (t) {
  models.ProductOrder.create({
    order_id: 1,
    product_id: 5,
    quantity: 1
  }, {transaction: t.transaction}).then(function () {
    t.end('Product order inserted with none available')
  }).catch(function (e) {
    t.end()
  })
})

test('Cannot update product order with none available', function (t) {
  models.ProductOrder.findOne({
    where: {id: 8}
  }).then(function (productOrder) {
    productOrder.update({
      quantity: 15
    }, {transaction: t.transaction}).then(function () {
      t.end('Product order updated with none available')
    }).catch(function (e) {
      t.end()
    })
  })
})

test('Updating quantity updates product.reserved', function (t) {
  models.ProductOrder.findOne({
    where: {id: 1},
    include: [{model: models.Product, as: 'product'}]
  }).then(function (productOrder) {
    productOrder.update({
      quantity: 5
    }, {transaction: t.transaction}).then(function () {
      productOrder.product.reload({
        transaction: t.transaction
      }).then(function () {
        t.equal(productOrder.product.reserved, 5)
        t.end()
      })
    })
  })
})

test('Inserting a new product order updates product.reserved', function (t) {
  models.ProductOrder.create({
    order_id: 2,
    product_id: 1,
    quantity: 3
  }, {transaction: t.transaction}).then(function (productOrder) {
    productOrder.getProduct({
      transaction: t.transaction
    }).then(function (product) {
      t.equal(product.reserved, 5)
      t.end()
    })
  })
})

test('Deleting a product order updates product.reserved', function (t) {
  models.ProductOrder.findOne({
    where: {id: 1},
    include: [{model: models.Product, as: 'product'}]
  }).then(function (productOrder) {
    productOrder.destroy({
      transaction: t.transaction
    }).then(function () {
      productOrder.product.reload({
        transaction: t.transaction
      }).then(function () {
        t.equal(productOrder.product.reserved, 0)
        t.end()
      })
    })
  })
})

test('insert: completed orders don\'t affect product.reserved', function (t) {
  models.ProductOrder.create({
    order_id: 3,
    product_id: 1,
    quantity: 3
  }, {transaction: t.transaction}).then(function (productOrder) {
    productOrder.getProduct({
      transaction: t.transaction
    }).then(function (product) {
      t.equal(product.reserved, 2)
      t.end()
    })
  })
})

test('delete: completed orders don\'t affect product.reserved', function (t) {
  models.ProductOrder.findOne({
    where: {id: 6},
    include: [{model: models.Product, as: 'product'}]
  }).then(function (productOrder) {
    productOrder.destroy({
      transaction: t.transaction
    }).then(function () {
      productOrder.product.reload({
        transaction: t.transaction
      }).then(function () {
        t.equal(productOrder.product.reserved, 3)
        t.end()
      })
    })
  })
})

test('Update: completed orders don\'t affect product.reserved', function (t) {
  models.ProductOrder.findOne({
    where: {id: 6},
    include: [{model: models.Product, as: 'product'}]
  }).then(function (productOrder) {
    productOrder.update({
      quantity: 5
    }, {transaction: t.transaction}).then(function () {
      productOrder.product.reload({
        transaction: t.transaction
      }).then(function () {
        t.equal(productOrder.product.reserved, 3)
        t.end()
      })
    })
  })
})

test('Inserting a new product order sets cost', function (t) {
  models.ProductOrder.create({
    order_id: 2,
    product_id: 1,
    quantity: 3
  }, {transaction: t.transaction}).then(function (productOrder) {
    t.equal(productOrder.cost, '14.00')
    t.end()
  })
})

test('validate cost', function (t) {
  models.ProductOrder.build({cost: 'asdf'})
  .validate({
    fields: ['cost']
  }).then(function (e) {
    if (e) return t.end()
    t.end('Should be invalid')
  })
})

test('validate cost', function (t) {
  models.ProductOrder.build({cost: '.53'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.ProductOrder.build({cost: '.53'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.ProductOrder.build({cost: '32'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.ProductOrder.build({cost: '32.25'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.ProductOrder.build({cost: '$32.25'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.ProductOrder.build({cost: '  10  '}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.ProductOrder.build({cost: '  $32.25  '}).validate({
    fields: ['cost']
  }).then(t.end)
})
