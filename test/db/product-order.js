'use strict'

const db = require('../../db')
const {Order, Product, ProductOrder} = require('../../db')
const test = require('../test')

test('ProductOrder reports the correct cost', function *(t) {
  const productOrder = new db.ProductOrder({
    cost: '5.75',
    quantity: 2
  })
  t.is(productOrder.total, 11.50)
})

test('Cannot insert product order for inactive products', function *(t) {
  try {
    yield ProductOrder.create({
      orderId: 2,
      productId: 7,
      quantity: 1
    })
    t.fail('Product order inserted for inactive product')
  } catch (error) { }
})

test('Cannot insert product order for inactive grower', function *(t) {
  try {
    yield ProductOrder.create({
      orderId: 2,
      productId: 6,
      quantity: 1
    })
    t.end('Product order inserted for inactive grower')
  } catch (error) { }
})

test('Cannot insert product order with none available', function *(t) {
  try {
    yield ProductOrder.create({
      orderId: 1,
      productId: 5,
      quantity: 1
    })
    t.end('Product order inserted with none available')
  } catch (error) { }
})

test('Cannot update product order with none available', function *(t) {
  try {
    const productOrder = yield ProductOrder.find(8)
    yield productOrder.update({quantity: 15})
    t.end('Product order updated with none available')
  } catch (error) { }
})

test('Updating quantity updates product.reserved', function *(t) {
  const productOrder = yield ProductOrder.find(1)
  yield productOrder.update({quantity: 5})
  const product = yield Product.find(1)
  t.is(product.reserved, 5)
})

test('Inserting a new product order updates product.reserved', function *(t) {
  yield ProductOrder.create({
    orderId: 2,
    productId: 1,
    quantity: 3
  })
  const product = yield Product.find(1)
  t.is(product.reserved, 5)
})

test('Deleting a product order updates product.reserved', function *(t) {
  const productOrder = yield ProductOrder.find(1)
  yield productOrder.destroy()
  const product = yield Product.find(1)
  t.is(product.reserved, 0)
})

test('insert: completed orders don\'t affect product.reserved', function *(t) {
  yield ProductOrder.create({
    orderId: 3,
    productId: 1,
    quantity: 3
  })
  const product = yield Product.find(1)
  t.is(product.reserved, 2)
})

test('delete: completed orders don\'t affect product.reserved', function *(t) {
  const productOrder = yield ProductOrder.find(6)
  yield productOrder.destroy()
  const product = yield Product.find(5)
  t.is(product.reserved, 3)
})

test('Update: completed orders don\'t affect product.reserved', function *(t) {
  const productOrder = yield ProductOrder.find(6)
  yield productOrder.update({quantity: 5})
  const product = yield Product.find(5)
  t.is(product.reserved, 3)
})

test('Inserting a new product order sets cost', function *(t) {
  const productOrder = yield ProductOrder.create({
    orderId: 2,
    productId: 1,
    quantity: 3
  })
  t.is(productOrder.cost, '14.00')
})

test('Deleting an order updates reserved values', function *(t) {
  const order = yield Order.find(1)
  yield order.destroy()
  const product = yield Product.find(1)
  t.is(product.reserved, 0)
})

test('Updating takes the previous quantity into account', function *(t) {
  const productOrder = yield ProductOrder.find(8)
  yield productOrder.update({quantity: 1})
})

test('validate cost', function *(t) {
  const productOrder = new db.ProductOrder({cost: 'asdf'})
  t.ok(!productOrder.valid)
  t.deepEqual(productOrder.errors, {
    cost: ['Cost must be a valid dollar amount']
  })
})

test('validate cost', function *(t) {
  t.ok(new db.ProductOrder({cost: '.53'}).valid)
})

test('validate cost', function *(t) {
  t.ok(new db.ProductOrder({cost: '32'}).valid)
})

test('validate cost', function *(t) {
  t.ok(new db.ProductOrder({cost: '32.25'}).valid)
})

test('validate cost', function *(t) {
  t.ok(new db.ProductOrder({cost: '$32.25'}).valid)
})

test('validate cost', function *(t) {
  t.ok(new db.ProductOrder({cost: '  10  '}).valid)
})

test('validate cost', function *(t) {
  t.ok(new db.ProductOrder({cost: '  $32.25  '}).valid)
})

test('checkout() with non-existent product does not throw', function *(t) {
  yield db.query('select checkout($1, $2, $3)', [1, 1, [[12345, 1]]])
})
