'use strict'

const test = require('../test')
const db = require('../../db')

test('Product#available subtracts reserved from supply', async (t) => {
  const product = new db.Product({
    supply: 100,
    reserved: 15
  })
  t.equal(product.available, 85)
  product.reserved = 112
  t.equal(product.available, 0)
})

test('oversold', async (t) => {
  const product = new db.Product({
    supply: 100,
    reserved: 15
  })
  t.ok(!product.oversold)
  product.supply = 10
  t.ok(product.oversold)
})

test('Product#reservedCost', async (t) => {
  const product = new db.Product({
    supply: 100,
    reserved: 8,
    cost: '1.25'
  })
  t.equal(product.reservedCost(), 10)
})

test('validate cost', async (t) => {
  const product = new db.Product({cost: 'asdf'})
  t.ok(!product.valid)
  t.deepEqual(product.errors.cost, ['Cost must be a valid dollar amount'])
})

test('validate cost', async (t) => {
  const product = new db.Product({cost: '.53'})
  product.validate()
  t.ok(!product.errors.cost)
})

test('validate cost', async (t) => {
  const product = new db.Product({cost: '32'})
  product.validate()
  t.ok(!product.errors.cost)
})

test('validate cost', async (t) => {
  const product = new db.Product({cost: '32.25'})
  product.validate()
  t.ok(!product.errors.cost)
})

test('validate cost', async (t) => {
  const product = new db.Product({cost: '32.25'})
  product.validate()
  t.ok(!product.errors.cost)
})

test('validate cost', async (t) => {
  const product = new db.Product({cost: '  10  '})
  product.validate()
  t.ok(!product.errors.cost)
})

test('validate cost', async (t) => {
  const product = new db.Product({cost: '  $32.25  '})
  product.validate()
  t.ok(!product.errors.cost)
})

test('validate name', async (t) => {
  const product = new db.Product({name: ''})
  product.validate()
  t.deepEqual(product.errors.name, ['Name cannot be blank'])
})

test('validate supply', async (t) => {
  const product = new db.Product({supply: -2})
  product.validate()
  t.deepEqual(product.errors.supply, ['Supply cannot be negative'])
})

test('non-numeric supply', async (t) => {
  const product = new db.Product({supply: 'asdf'})
  product.validate()
  t.deepEqual(product.errors.supply, ['Supply must be a number'])
})

test('empty supply', async (t) => {
  const product = new db.Product({supply: ''})
  product.validate()
  t.deepEqual(product.errors.supply, ['Supply must be a number'])
})
