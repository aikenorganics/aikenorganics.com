'use strict'

const test = require('../test')
const driver = require('../driver')
const Product = require('../../db/product')

test('edit cost', function *(assert) {
  yield driver.visit('/signin')
  yield driver.$('#email').sendKeys('admin@example.com')
  yield driver.$('#password').sendKeys('password')
  yield driver.$('#password').submit()
  yield driver.wait(driver.present('#signout'))

  yield driver.visit('/products/3/edit')
  yield driver.$('#cost').clear()
  yield driver.$('#cost').sendKeys('5.55')
  yield driver.$('#cost').submit()
  yield driver.wait(driver.present('#message:not(.active)'))
  const product = yield Product.find(3)
  assert.is(product.cost, '5.55')
})
