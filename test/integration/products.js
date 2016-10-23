'use strict'

const test = require('../test')
const driver = require('../driver')
const Product = require('../../db/product')

test('edit cost', function *(assert) {
  yield driver.signIn('admin@example.com')
  yield driver.visit('/products/3/edit')
  yield driver.$('#cost').clear()
  yield driver.$('#cost').sendKeys('5.55')
  yield driver.$('#cost').submit()
  yield driver.wait(driver.present('#message:not(.active)'))
  const product = yield Product.find(3)
  assert.is(product.cost, '5.55')
})

test('deactivate product', function *(assert) {
  yield driver.signIn('admin@example.com')
  yield driver.visit('/products/1/edit')
  yield driver.$('#deactivate').click()
  yield driver.wait(driver.present('#activate'))
  const product = yield Product.find(1)
  assert.is(product.active, false)
})

test('activate product', function *(assert) {
  yield driver.signIn('admin@example.com')
  yield driver.visit('/products/8/edit')
  yield driver.$('#activate').click()
  yield driver.wait(driver.present('#deactivate'))
  const product = yield Product.find(8)
  assert.is(product.active, true)
})
