'use strict'

let db = require('../../db')
let test = require('../test')

test('ProductOrder reports the correct cost', (t) => {
  let productOrder = new db.ProductOrder({
    cost: '5.75',
    quantity: 2
  })
  t.is(productOrder.total, 11.50)
  t.end()
})

test('Cannot insert product order for inactive products', (t) => {
  db.ProductOrder.create({
    orderId: 2,
    productId: 7,
    quantity: 1
  }).then(() => {
    t.end('Product order inserted for inactive product')
  }).catch(() => {
    t.end()
  })
})

test('Cannot insert product order for inactive grower', (t) => {
  db.ProductOrder.create({
    orderId: 2,
    productId: 6,
    quantity: 1
  }).then(() => {
    t.end('Product order inserted for inactive grower')
  }).catch(() => {
    t.end()
  })
})

test('Cannot insert product order with none available', (t) => {
  db.ProductOrder.create({
    orderId: 1,
    productId: 5,
    quantity: 1
  }).then(() => {
    t.end('Product order inserted with none available')
  }).catch(() => {
    t.end()
  })
})

test('Cannot update product order with none available', (t) => {
  db.ProductOrder.find(8).then((productOrder) => {
    productOrder.update({quantity: 15}).then(() => {
      t.end('Product order updated with none available')
    }).catch(() => {
      t.end()
    })
  }).catch(t.end)
})

test('Updating quantity updates product.reserved', (t) => {
  const verify = () => {
    return db.Product.find(1).then((product) => {
      t.is(product.reserved, 5)
      t.end()
    })
  }

  db.ProductOrder.find(1).then((productOrder) => {
    return productOrder.update({quantity: 5}).then(verify)
  }).catch(t.end)
})

test('Inserting a new product order updates product.reserved', (t) => {
  const verify = () => {
    return db.Product.find(1).then((product) => {
      t.is(product.reserved, 5)
      t.end()
    })
  }

  db.ProductOrder.create({
    orderId: 2,
    productId: 1,
    quantity: 3
  }).then(verify).catch(t.end)
})

test('Deleting a product order updates product.reserved', (t) => {
  const verify = () => {
    return db.Product.find(1).then((product) => {
      t.is(product.reserved, 0)
      t.end()
    })
  }

  db.ProductOrder.find(1).then((productOrder) => {
    return productOrder.destroy().then(verify)
  }).catch(t.end)
})

test('insert: completed orders don\'t affect product.reserved', (t) => {
  const verify = () => {
    return db.Product.find(1).then((product) => {
      t.is(product.reserved, 2)
      t.end()
    })
  }

  db.ProductOrder.create({
    orderId: 3,
    productId: 1,
    quantity: 3
  }).then(verify).catch(t.end)
})

test('delete: completed orders don\'t affect product.reserved', (t) => {
  const verify = () => {
    return db.Product.find(5).then((product) => {
      t.is(product.reserved, 3)
      t.end()
    })
  }

  db.ProductOrder.find(6).then((productOrder) => {
    return productOrder.destroy().then(verify)
  }).catch(t.end)
})

test('Update: completed orders don\'t affect product.reserved', (t) => {
  const verify = () => {
    return db.Product.find(5).then((product) => {
      t.is(product.reserved, 3)
      t.end()
    })
  }

  db.ProductOrder.find(6).then((productOrder) => {
    return productOrder.update({quantity: 5}).then(verify)
  }).catch(t.end)
})

test('Inserting a new product order sets cost', (t) => {
  db.ProductOrder.create({orderId: 2, productId: 1, quantity: 3})
  .then((productOrder) => {
    t.is(productOrder.cost, '14.00')
    t.end()
  }).catch(t.end)
})

test('Deleting an order updates reserved values', (t) => {
  const verify = () => {
    return db.Product.find(1).then((product) => {
      t.is(product.reserved, 0)
      t.end()
    })
  }

  db.Order.find(1).then((order) => {
    return order.destroy().then(verify)
  }).catch(t.end)
})

test('Updating takes the previous quantity into account', (t) => {
  db.ProductOrder.find(8).then((productOrder) => {
    return productOrder.update({quantity: 1}).then(() => {
      t.end()
    })
  }).catch(t.end)
})

test('validate cost', (t) => {
  let productOrder = new db.ProductOrder({cost: 'asdf'})
  t.ok(!productOrder.valid)
  t.deepEqual(productOrder.errors, {
    cost: ['Cost must be a valid dollar amount']
  })
  t.end()
})

test('validate cost', (t) => {
  t.ok(new db.ProductOrder({cost: '.53'}).valid)
  t.end()
})

test('validate cost', (t) => {
  t.ok(new db.ProductOrder({cost: '32'}).valid)
  t.end()
})

test('validate cost', (t) => {
  t.ok(new db.ProductOrder({cost: '32.25'}).valid)
  t.end()
})

test('validate cost', (t) => {
  t.ok(new db.ProductOrder({cost: '$32.25'}).valid)
  t.end()
})

test('validate cost', (t) => {
  t.ok(new db.ProductOrder({cost: '  10  '}).valid)
  t.end()
})

test('validate cost', (t) => {
  t.ok(new db.ProductOrder({cost: '  $32.25  '}).valid)
  t.end()
})

test('checkout() with non-existent product does not throw', (t) => {
  db.query('select checkout($1, $2, $3)', [1, 1, [[12345, 1]]])
  .then(() => { t.end() }).catch(t.end)
})
