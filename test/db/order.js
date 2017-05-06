'use strict'

const {Order, Product, ProductOrder} = require('../../db')
const test = require('../test')

test('orders without productOrders have undefined total', async ({assert}) => {
  const order = new Order()
  assert.is(order.total, undefined)
})

test('Order reports the correct cost', async ({assert}) => {
  const order = new Order()
  order.productOrders = []

  order.productOrders.push(new ProductOrder({
    cost: '5.75',
    quantity: 2
  }))
  order.productOrders[0].product = new Product({
    name: 'Peaches',
    cost: '5.75',
    supply: 15
  })

  order.productOrders.push(new ProductOrder({
    cost: '2.50',
    quantity: 3
  }))

  order.productOrders[1].product = new Product({
    name: 'Strawberries',
    cost: '2.50',
    supply: 10
  })

  assert.equal(order.total, 19)
})

test('validate locationId', async ({assert}) => {
  const order = new Order()

  for (const value of [1, 1.5, -2, 1.23, 0, undefined, null]) {
    order.locationId = value
    order.validate()
    assert.ok(!order.errors.locationId)
  }

  for (const value of ['', '1', 'asdf', NaN, Infinity]) {
    order.locationId = value
    order.validate()
    assert.deepEqual(order.errors.locationId, ['Location ID must be a number.'])
  }
})

test('validate userId', async ({assert}) => {
  const order = new Order()

  for (const value of [1, 1.5, -2, 1.23, 0]) {
    order.userId = value
    order.validate()
    assert.ok(!order.errors.userId)
  }

  for (const value of ['', '1', 'asdf', NaN, Infinity, undefined, null]) {
    order.userId = value
    order.validate()
    assert.deepEqual(order.errors.userId, ['User ID must be a number.'])
  }
})
