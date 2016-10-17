'use strict'

const db = require('../../db')
const test = require('../test')

test('orders without productOrders have undefined total', function *(t) {
  const order = new db.Order()
  t.is(order.total, undefined)
  t.end()
})

test('Order reports the correct cost', function *(t) {
  const order = new db.Order()
  order.productOrders = []

  order.productOrders.push(new db.ProductOrder({
    cost: '5.75',
    quantity: 2
  }))
  order.productOrders[0].product = new db.Product({
    name: 'Peaches',
    cost: '5.75',
    supply: 15
  })

  order.productOrders.push(new db.ProductOrder({
    cost: '2.50',
    quantity: 3
  }))

  order.productOrders[1].product = new db.Product({
    name: 'Strawberries',
    cost: '2.50',
    supply: 10
  })

  t.equal(order.total, 19)
  t.end()
})
