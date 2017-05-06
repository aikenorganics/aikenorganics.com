'use strict'

const test = require('../test')
const {Product} = require('../../db')

test('Product#available subtracts reserved from supply', async ({assert}) => {
  const product = new Product({
    supply: 100,
    reserved: 15
  })
  assert.equal(product.available, 85)
  product.reserved = 112
  assert.equal(product.available, 0)
})

test('oversold', async ({assert}) => {
  const product = new Product({
    supply: 100,
    reserved: 15
  })
  assert.ok(!product.oversold)
  product.supply = 10
  assert.ok(product.oversold)
})

test('Product#reservedCost', async ({assert}) => {
  const product = new Product({
    supply: 100,
    reserved: 8,
    cost: '1.25'
  })
  assert.equal(product.reservedCost(), 10)
})

test('validate cost', async ({assert}) => {
  const product = new Product({cost: 'asdf'})
  assert.ok(!product.valid)
  assert.deepEqual(product.errors.cost, ['Cost must be a valid dollar amount'])
})

test('validate cost', async ({assert}) => {
  const product = new Product({cost: '.53'})
  product.validate()
  assert.ok(!product.errors.cost)
})

test('validate cost', async ({assert}) => {
  const product = new Product({cost: '32'})
  product.validate()
  assert.ok(!product.errors.cost)
})

test('validate cost', async ({assert}) => {
  const product = new Product({cost: '32.25'})
  product.validate()
  assert.ok(!product.errors.cost)
})

test('validate cost', async ({assert}) => {
  const product = new Product({cost: '32.25'})
  product.validate()
  assert.ok(!product.errors.cost)
})

test('validate cost', async ({assert}) => {
  const product = new Product({cost: '  10  '})
  product.validate()
  assert.ok(!product.errors.cost)
})

test('validate cost', async ({assert}) => {
  const product = new Product({cost: '  $32.25  '})
  product.validate()
  assert.ok(!product.errors.cost)
})

test('validate name', async ({assert}) => {
  const product = new Product({name: ''})
  product.validate()
  assert.deepEqual(product.errors.name, ['Name cannot be blank'])
})

test('validate supply', async ({assert}) => {
  const product = new Product({supply: -2})
  product.validate()
  assert.deepEqual(product.errors.supply, ['Supply cannot be negative'])
})

test('non-numeric supply', async ({assert}) => {
  const product = new Product({supply: 'asdf'})
  product.validate()
  assert.deepEqual(product.errors.supply, ['Supply must be a number'])
})

test('empty supply', async ({assert}) => {
  const product = new Product({supply: ''})
  product.validate()
  assert.deepEqual(product.errors.supply, ['Supply must be a number'])
})
