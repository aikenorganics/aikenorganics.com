'use strict'

let db = require('../../db')
let test = require('../test')
let Cart = require('../../lib/cart')

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
  new Cart(session).update(new db.Product({id: 5}), 2)
  t.deepEqual(session.cart, {5: 2})
  t.end()
})

test('update with zero key', function (t) {
  let session = {cart: {5: 2}}
  new Cart(session).update(new db.Product({id: 5}), 0)
  t.deepEqual(session.cart, {})
  t.end()
})

test('checkout quantity', function (t) {
  let product = new db.Product({id: 1, supply: 5, reserved: 3})
  let cart = new Cart({cart: {1: 3}})
  t.equal(cart.quantity(product), 2)
  t.end()
})

test('checkout total', function (t) {
  db.Product.include('grower').find(1).then((product) => {
    let cart = new Cart({cart: {1: 3}})
    t.equal(cart.total(product), 42)
    t.end()
  }).catch(t.end)
})

test('checkout total for inactive product', function (t) {
  db.Product.include('grower').find(8).then((product) => {
    let cart = new Cart({cart: {8: 3}})
    t.equal(cart.total(product), 0)
    t.end()
  }).catch(t.end)
})

test('checkout total for inactive grower', function (t) {
  db.Product.include('grower').find(6).then((product) => {
    let cart = new Cart({cart: {6: 3}})
    t.equal(cart.total(product), 0)
    t.end()
  }).catch(t.end)
})

test('checkout total for multiple products', function (t) {
  db.Product.include('grower').where({id: [1, 2, 8]}).all()
  .then((products) => {
    let cart = new Cart({cart: {1: 3, 2: 2, 8: 1}})
    t.equal(cart.total(products), 58)
    t.end()
  }).catch(t.end)
})
