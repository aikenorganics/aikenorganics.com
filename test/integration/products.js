'use strict'

const test = require('../test')
const Product = require('../../db/product')

test('edit cost', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/products/3/edit')
  await browser.find('#cost').clear()
  await browser.find('#cost').sendKeys('5.55')
  await browser.find('#cost').submit()
  await browser.assertSelector('#message:not(.active)')
  const product = await Product.find(3)
  assert.is(product.cost, '5.55')
})

test('deactivate product', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/products/1/edit')
  await browser.find('#deactivate').click()
  await browser.assertSelector('#activate')
  const product = await Product.find(1)
  assert.is(product.active, false)
})

test('activate product', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/products/8/edit')
  await browser.find('#activate').click()
  await browser.assertSelector('#deactivate')
  const product = await Product.find(8)
  assert.is(product.active, true)
})
