'use strict'

const db = require('../../db')
const test = require('../test')
const Cart = require('../../lib/cart')

test('get the correct keys', (t) => {
  t.deepEqual(new Cart({cart: {1: 2, 3: 4}}).ids, [1, 3])
  t.end()
})

test('clear the cart', (t) => {
  const session = {cart: {1: 2, 3: 4}}
  new Cart(session).clear()
  t.deepEqual(session.cart, {})
  t.end()
})

test('cart size', (t) => {
  t.equal(new Cart({cart: {1: 2, 3: 4}}).size, 6)
  t.end()
})

test('update with positive key', (t) => {
  const session = {}
  new Cart(session).update(new db.Product({id: 5}), 2)
  t.deepEqual(session.cart, {5: 2})
  t.end()
})

test('update with zero key', (t) => {
  const session = {cart: {5: 2}}
  new Cart(session).update(new db.Product({id: 5}), 0)
  t.deepEqual(session.cart, {})
  t.end()
})

test('checkout quantity', (t) => {
  const product = new db.Product({id: 1, supply: 5, reserved: 3})
  const cart = new Cart({cart: {1: 3}})
  t.equal(cart.quantity(product), 2)
  t.end()
})

test('checkout total', (t) => {
  db.Product.include('grower').find(1).then((product) => {
    const cart = new Cart({cart: {1: 3}})
    t.equal(cart.total(product), 42)
    t.end()
  }).catch(t.end)
})

test('checkout total for inactive product', (t) => {
  db.Product.include('grower').find(8).then((product) => {
    const cart = new Cart({cart: {8: 3}})
    t.equal(cart.total(product), 0)
    t.end()
  }).catch(t.end)
})

test('checkout total for inactive grower', (t) => {
  db.Product.include('grower').find(6).then((product) => {
    const cart = new Cart({cart: {6: 3}})
    t.equal(cart.total(product), 0)
    t.end()
  }).catch(t.end)
})

test('checkout total for multiple products', (t) => {
  db.Product.include('grower').where({id: [1, 2, 8]}).all()
  .then((products) => {
    const cart = new Cart({cart: {1: 3, 2: 2, 8: 1}})
    t.equal(cart.total(products), 58)
    t.end()
  }).catch(t.end)
})

test('checking out with an inactive location raises', (t) => {
  db.query('select checkout($1, $2, $3)', [1, 3, [1, 1]]).then(() => {
    t.end('Inactive locations should raise.')
  }).catch((e) => {
    t.end()
  })
})

test('oversold products do not create a product order', (t) => {
  db.query('select checkout($1, $2, $3)', [1, 1, [9, 2]]).then(() => {
    return db.ProductOrder.where({
      order_id: 1,
      product_id: 9
    }).find().then((productOrder) => {
      t.ok(productOrder == null)
      t.end()
    })
  }).catch(t.end)
})
