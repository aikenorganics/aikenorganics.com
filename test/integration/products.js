'use strict'

const test = require('../test')
const browser = require('../browser')
const Product = require('../../db/product')

test('edit cost', async (assert) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/products/3/edit')
  await browser.$('#cost').clear()
  await browser.$('#cost').sendKeys('5.55')
  await browser.$('#cost').submit()
  await browser.wait(browser.present('#message:not(.active)'))
  const product = await Product.find(3)
  assert.is(product.cost, '5.55')
})

test('deactivate product', async (assert) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/products/1/edit')
  await browser.$('#deactivate').click()
  await browser.wait(browser.present('#activate'))
  const product = await Product.find(1)
  assert.is(product.active, false)
})

test('activate product', async (assert) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/products/8/edit')
  await browser.$('#activate').click()
  await browser.wait(browser.present('#deactivate'))
  const product = await Product.find(8)
  assert.is(product.active, true)
})
