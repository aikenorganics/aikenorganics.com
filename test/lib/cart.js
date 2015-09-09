'use strict'

let test = require('../test')
let Cart = require('../../lib/cart')
let models = require('../../models')

test('get the correct keys', function (t) {
  t.deepEqual(new Cart({cart: {1: 2, 3: 4}}).ids(), [1, 3])
  t.end()
})

test('clear the cart', function (t) {
  let session = {cart: {1: 2, 3: 4}}
  new Cart(session).clear()
  t.deepEqual(session.cart, {})
  t.end()
})

test('cart size', function (t) {
  t.equal(new Cart({cart: {1: 2, 3: 4}}).size(), 6)
  t.end()
})

test('update with positive key', function (t) {
  let session = {}
  new Cart(session).update(models.Product.build({id: 5}), 2)
  t.deepEqual(session.cart, {5: 2})
  t.end()
})

test('update with zero key', function (t) {
  let session = {cart: {5: 2}}
  new Cart(session).update(models.Product.build({id: 5}), 0)
  t.deepEqual(session.cart, {})
  t.end()
})

test('checkout quantity', function (t) {
  let product = models.Product.build({id: 1, supply: 5, reserved: 3})
  let cart = new Cart({cart: {1: 3}})
  t.equal(cart.quantity(product), 2)
  t.end()
})

test('checkout total', function (t) {
  let product = models.Product.build({
    id: 1,
    supply: 5,
    reserved: 3,
    cost: '1.15'
  })
  let cart = new Cart({cart: {1: 3}})
  t.equal(cart.total(product), 2.30)
  t.end()
})

test('checkout total for multiple products', function (t) {
  let products = [
    models.Product.build({
      id: 1,
      supply: 5,
      reserved: 3,
      cost: '1.15'
    }),
    models.Product.build({
      id: 2,
      supply: 6,
      reserved: 2,
      cost: '2.50'
    })
  ]
  let cart = new Cart({cart: {1: 3, 2: 2}})
  t.equal(cart.total(products), 7.30)
  t.end()
})
