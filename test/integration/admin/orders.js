'use strict'

const test = require('../../test')
const driver = require('../../driver')
const {Order, ProductOrder} = require('../../../db')

test('delete product order', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/admin/orders/2')

  const count = await ProductOrder.where({orderId: 2}).count()

  await driver.$('#remove-product-order-3').click()
  await driver.alert().accept()
  await driver.wait(driver.present('#message:not(.active)'))

  assert.is(await ProductOrder.where({orderId: 2}).count(), count - 1)
})

test('change location', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/admin/orders/2')

  assert.is((await Order.find(2)).locationId, 1)

  await driver.$('#location [value="3"]').click()
  await driver.wait(driver.present('#message:not(.active)'))

  assert.is((await Order.find(2)).locationId, 3)
})

test('add product', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/admin/orders/2')

  const count = await ProductOrder.where({orderId: 2}).count()

  await driver.$('#add-to-order [value="1"]').click()
  await driver.wait(driver.present('#message:not(.active)'))

  assert.is(await ProductOrder.where({orderId: 2}).count(), count + 1)
})
