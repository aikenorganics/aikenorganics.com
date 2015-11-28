'use strict'

let db = require('../../db')
let test = require('../test')

test('ProductOrder reports the correct cost', function (t) {
  let productOrder = new db.ProductOrder({
    cost: '5.75',
    quantity: 2
  })
  t.is(productOrder.total(), 11.50)
  t.end()
})

test('Cannot insert product order for inactive products', function (t) {
  db.ProductOrder.create({
    order_id: 2,
    product_id: 7,
    quantity: 1
  }).then(function () {
    t.end('Product order inserted for inactive product')
  }).catch(function (e) {
    t.end()
  })
})

test('Cannot insert product order for inactive grower', function (t) {
  db.ProductOrder.create({
    order_id: 2,
    product_id: 6,
    quantity: 1
  }).then(function () {
    t.end('Product order inserted for inactive grower')
  }).catch(function (e) {
    t.end()
  })
})

test('Cannot insert product order with none available', function (t) {
  db.ProductOrder.create({
    order_id: 1,
    product_id: 5,
    quantity: 1
  }).then(function () {
    t.end('Product order inserted with none available')
  }).catch(function (e) {
    t.end()
  })
})

test('Cannot update product order with none available', function (t) {
  db.ProductOrder.find(8).then(function (productOrder) {
    productOrder.update({quantity: 15}).then(function () {
      t.end('Product order updated with none available')
    }).catch(function (e) {
      t.end()
    })
  }).catch(t.end)
})

test('Updating quantity updates product.reserved', function (t) {
  db.ProductOrder.find(1).then(function (productOrder) {
    return db.transaction(function () {
      productOrder.update({quantity: 5}).then(verify)
    })
  }).catch(t.end)

  function verify () {
    return db.transaction(function () {
      db.Product.find(1).then(function (product) {
        t.is(product.reserved, 5)
        t.end()
      })
    })
  }
})

test('Inserting a new product order updates product.reserved', function (t) {
  db.transaction(function () {
    db.ProductOrder.create({
      order_id: 2,
      product_id: 1,
      quantity: 3
    }).then(verify)
  }).catch(t.end)

  function verify () {
    return db.transaction(function () {
      db.Product.find(1).then(function (product) {
        t.is(product.reserved, 5)
        t.end()
      })
    })
  }
})

test('Deleting a product order updates product.reserved', function (t) {
  db.ProductOrder.find(1).then(function (productOrder) {
    db.transaction(function () {
      productOrder.destroy().then(verify)
    })
  }).catch(t.end)

  function verify () {
    return db.transaction(function () {
      db.Product.find(1).then(function (product) {
        t.is(product.reserved, 0)
        t.end()
      })
    })
  }
})

test('insert: completed orders don\'t affect product.reserved', function (t) {
  db.transaction(function () {
    db.ProductOrder.create({
      order_id: 3,
      product_id: 1,
      quantity: 3
    }).then(verify)
  }).catch(t.end)

  function verify () {
    return db.transaction(function () {
      db.Product.find(1).then(function (product) {
        t.is(product.reserved, 2)
        t.end()
      })
    })
  }
})

test('delete: completed orders don\'t affect product.reserved', function (t) {
  db.ProductOrder.find(6).then(function (productOrder) {
    db.transaction(function () {
      productOrder.destroy().then(verify)
    })
  }).catch(t.end)

  function verify () {
    return db.transaction(function () {
      db.Product.find(5).then(function (product) {
        t.is(product.reserved, 3)
        t.end()
      })
    })
  }
})

test('Update: completed orders don\'t affect product.reserved', function (t) {
  db.ProductOrder.find(6).then(function (productOrder) {
    db.transaction(function () {
      productOrder.update({quantity: 5}).then(verify)
    })
  }).catch(t.end)

  function verify () {
    return db.transaction(function () {
      db.Product.find(5).then(function (product) {
        t.is(product.reserved, 3)
        t.end()
      })
    })
  }
})

test('Inserting a new product order sets cost', function (t) {
  db.transaction(function () {
    db.ProductOrder.create({order_id: 2, product_id: 1, quantity: 3})
    .then(function (productOrder) {
      t.is(productOrder.cost, '14.00')
      t.end()
    })
  }).catch(t.end)
})

test('Deleting an order updates reserved values', function (t) {
  db.Order.find(1).then(function (order) {
    db.transaction(function () {
      order.destroy().then(verify)
    })
  }).catch(t.end)

  function verify () {
    return db.transaction(function () {
      db.Product.find(1).then(function (product) {
        t.is(product.reserved, 0)
        t.end()
      })
    })
  }
})

test('Updating takes the previous quantity into account', function (t) {
  db.ProductOrder.find(8).then(function (productOrder) {
    return db.transaction(function () {
      productOrder.update({quantity: 1}).then(function () {
        t.end()
      })
    })
  }).catch(t.end)
})

test('validate cost', function (t) {
  let productOrder = new db.ProductOrder({cost: 'asdf'})
  t.ok(!productOrder.valid)
  t.deepEqual(productOrder.errors, {
    cost: ['Cost must be a valid dollar amount']
  })
  t.end()
})

test('validate cost', function (t) {
  t.ok(new db.ProductOrder({cost: '.53'}).valid)
  t.end()
})

test('validate cost', function (t) {
  t.ok(new db.ProductOrder({cost: '32'}).valid)
  t.end()
})

test('validate cost', function (t) {
  t.ok(new db.ProductOrder({cost: '32.25'}).valid)
  t.end()
})

test('validate cost', function (t) {
  t.ok(new db.ProductOrder({cost: '$32.25'}).valid)
  t.end()
})

test('validate cost', function (t) {
  t.ok(new db.ProductOrder({cost: '  10  '}).valid)
  t.end()
})

test('validate cost', function (t) {
  t.ok(new db.ProductOrder({cost: '  $32.25  '}).valid)
  t.end()
})

test('checkout() with non-existent product does not throw', function (t) {
  db.query('select checkout($1, $2, $3)', [1, 1, [[12345, 1]]])
  .then(() => { t.end() }).catch(t.end)
})
