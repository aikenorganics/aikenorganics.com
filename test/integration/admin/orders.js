'use strict'

const test = require('../../test')
const {Order, ProductOrder} = require('../../../db')

test('delete product order', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/orders/2')

  const count = await ProductOrder.where({orderId: 2}).count()

  await browser.$('#remove-product-order-3').click()
  await browser.alert().accept()
  await browser.assert('#message:not(.active)')

  assert.is(await ProductOrder.where({orderId: 2}).count(), count - 1)
})

test('change location', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/orders/2')

  assert.is((await Order.find(2)).locationId, 1)

  await browser.$('#location [value="3"]').click()
  await browser.assert('#message:not(.active)')

  assert.is((await Order.find(2)).locationId, 3)
})

test('add product', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/orders/2')

  const count = await ProductOrder.where({orderId: 2}).count()

  await browser.$('#add-to-order [value="1"]').click()
  await browser.assert('#message:not(.active)')

  assert.is(await ProductOrder.where({orderId: 2}).count(), count + 1)
})
