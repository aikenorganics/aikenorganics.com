'use strict'

const db = require('../../db')
const {Product, ProductOrder} = require('../../db')
const test = require('../test')
const Cart = require('../../lib/cart')

test('get the correct keys', async (assert) => {
  assert.deepEqual(new Cart({cart: {1: 2, 3: 4}}).ids, [1, 3])
})

test('clear the cart', async (assert) => {
  const session = {cart: {1: 2, 3: 4}}
  new Cart(session).clear()
  assert.deepEqual(session.cart, {})
})

test('cart size', async (assert) => {
  assert.equal(new Cart({cart: {1: 2, 3: 4}}).size, 6)
})

test('update with positive key', async (assert) => {
  const session = {}
  new Cart(session).update(new Product({id: 5}), 2)
  assert.deepEqual(session.cart, {5: 2})
})

test('update with zero key', async (assert) => {
  const session = {cart: {5: 2}}
  new Cart(session).update(new Product({id: 5}), 0)
  assert.deepEqual(session.cart, {})
})

test('checkout quantity', async (assert) => {
  const product = new Product({id: 1, supply: 5, reserved: 3})
  const cart = new Cart({cart: {1: 3}})
  assert.equal(cart.quantity(product), 2)
})

test('checkout total', async (assert) => {
  const product = await Product.include('grower').find(1)
  const cart = new Cart({cart: {1: 3}})
  assert.equal(cart.total(product), 42)
})

test('checkout total for inactive product', async (assert) => {
  const product = await Product.include('grower').find(8)
  const cart = new Cart({cart: {8: 3}})
  assert.equal(cart.total(product), 0)
})

test('checkout total for inactive grower', async (assert) => {
  const product = await Product.include('grower').find(6)
  const cart = new Cart({cart: {6: 3}})
  assert.equal(cart.total(product), 0)
})

test('checkout total for multiple products', async (assert) => {
  const products = await Product.include('grower').where({id: [1, 2, 8]}).all()
  const cart = new Cart({cart: {1: 3, 2: 2, 8: 1}})
  assert.equal(cart.total(products), 58)
})

test('checking out with an inactive location raises', async (assert) => {
  try {
    await db.query('select checkout($1, $2, $3)', [1, 3, [1, 1]])
    assert.end('Inactive locations should raise.')
  } catch (error) { }
})

test('oversold products do not create a product order', async (assert) => {
  await db.query('select checkout($1, $2, $3)', [1, 1, [9, 2]])
  const productOrder = await ProductOrder.where({
    orderId: 1,
    productId: 9
  }).find()
  assert.ok(!productOrder)
})
