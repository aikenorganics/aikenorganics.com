'use strict'

const test = require('../../test')
const driver = require('../../driver')
const {ProductOrder} = require('../../../db')

test('delete product order', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/admin/orders/2')

  const count = await ProductOrder.where({orderId: 2}).count()

  await driver.$('#product-orders tbody tr:first-child button:not([hidden])').click()
  await driver.alert().accept()
  await driver.wait(driver.present('#message:not(.active)'))

  assert.is(await ProductOrder.where({orderId: 2}).count(), count - 1)
})
