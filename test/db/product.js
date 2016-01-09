'use strict'

let test = require('../test')
let db = require('../../db')

test('Product#available subtracts reserved from supply', function (t) {
  let product = new db.Product({
    supply: 100,
    reserved: 15
  })
  t.equal(product.available, 85)
  product.reserved = 112
  t.equal(product.available, 0)
  t.end()
})

test('Product#isOversold', function (t) {
  let product = new db.Product({
    supply: 100,
    reserved: 15
  })
  t.ok(!product.isOversold())
  product.supply = 10
  t.ok(product.isOversold())
  t.end()
})

test('Product#reservedCost', function (t) {
  let product = new db.Product({
    supply: 100,
    reserved: 8,
    cost: '1.25'
  })
  t.equal(product.reservedCost(), 10)
  t.end()
})

test('validate cost', function (t) {
  let product = new db.Product({cost: 'asdf'})
  t.ok(!product.valid)
  t.deepEqual(product.errors.cost, ['Cost must be a valid dollar amount'])
  t.end()
})

test('validate cost', function (t) {
  let product = new db.Product({cost: '.53'})
  product.validate()
  t.ok(!product.errors.cost)
  t.end()
})

test('validate cost', function (t) {
  let product = new db.Product({cost: '32'})
  product.validate()
  t.ok(!product.errors.cost)
  t.end()
})

test('validate cost', function (t) {
  let product = new db.Product({cost: '32.25'})
  product.validate()
  t.ok(!product.errors.cost)
  t.end()
})

test('validate cost', function (t) {
  let product = new db.Product({cost: '32.25'})
  product.validate()
  t.ok(!product.errors.cost)
  t.end()
})

test('validate cost', function (t) {
  let product = new db.Product({cost: '  10  '})
  product.validate()
  t.ok(!product.errors.cost)
  t.end()
})

test('validate cost', function (t) {
  let product = new db.Product({cost: '  $32.25  '})
  product.validate()
  t.ok(!product.errors.cost)
  t.end()
})

test('validate name', function (t) {
  let product = new db.Product({name: ''})
  product.validate()
  t.deepEqual(product.errors.name, ['Name cannot be blank'])
  t.end()
})

test('validate supply', function (t) {
  let product = new db.Product({supply: -2})
  product.validate()
  t.deepEqual(product.errors.supply, ['Supply cannot be negative'])
  t.end()
})
