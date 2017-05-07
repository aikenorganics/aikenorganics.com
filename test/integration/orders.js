'use strict'

const test = require('../test')
const {Market, ProductOrder} = require('../../db')

test('remove an item from your order', async ({assert, browser}) => {
  await browser.signIn('user@example.com')
  await browser.visit('/orders/current')

  const count = await ProductOrder.where({orderId: 2}).count()

  await browser.find('#remove-product-order-3').click()
  await browser.alert().accept()
  await browser.assertSelector('#message:not(.active)')

  assert.is(await ProductOrder.where({orderId: 2}).count(), count - 1)
})

test('cannot remove an item from your order when closed', async ({assert, browser}) => {
  await (await Market.find(1)).update({closed: true})
  await browser.signIn('user@example.com')
  await browser.visit('/orders/current')
  await browser.refuteSelector('#remove-product-order-3')
})
