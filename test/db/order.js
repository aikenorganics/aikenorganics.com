'use strict'

let db = require('../../db')
let test = require('../test')

test('Order reports the correct cost', function (t) {
  let order = new db.Order()
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

  t.equal(order.total(), 19)
  t.end()
})
