'use strict'

const test = require('../test')
const driver = require('../driver')
const Product = require('../../db/product')

test('edit cost', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/products/3/edit')
  await driver.$('#cost').clear()
  await driver.$('#cost').sendKeys('5.55')
  await driver.$('#cost').submit()
  await driver.wait(driver.present('#message:not(.active)'))
  const product = await Product.find(3)
  assert.is(product.cost, '5.55')
})

test('deactivate product', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/products/1/edit')
  await driver.$('#deactivate').click()
  await driver.wait(driver.present('#activate'))
  const product = await Product.find(1)
  assert.is(product.active, false)
})

test('activate product', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/products/8/edit')
  await driver.$('#activate').click()
  await driver.wait(driver.present('#deactivate'))
  const product = await Product.find(8)
  assert.is(product.active, true)
})
