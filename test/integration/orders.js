'use strict'

const test = require('../test')
const driver = require('../driver')
const {Market, ProductOrder} = require('../../db')

test('remove an item from your order', async (assert) => {
  await driver.signIn('user@example.com')
  await driver.visit('/orders/current')

  const count = await ProductOrder.where({orderId: 2}).count()

  await driver.$('#remove-product-order-3').click()
  await driver.alert().accept()
  await driver.wait(driver.present('#message:not(.active)'))

  assert.is(await ProductOrder.where({orderId: 2}).count(), count - 1)
})

test('cannot remove an item from your order when closed', async (assert) => {
  await (await Market.find(1)).update({closed: true})
  await driver.signIn('user@example.com')
  await driver.visit('/orders/current')

  assert.ok(!await driver.exists('#remove-product-order-3'))
})
