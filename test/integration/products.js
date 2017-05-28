'use strict'

const test = require('../test')
const Product = require('../../db/product')

test('search for a product', async ({assert, browser}) => {
  await browser.visit('/products')
  const search = await browser.find('input[type="search"]')

  await browser.assertText('Avocados')
  await browser.assertText('Strawberries')

  await search.sendKeys('avocado')
  await search.submit()
  await browser.assertText('Avocados')
  await browser.refuteText('Strawberries')

  await search.clear()
  await search.sendKeys('straw')
  await search.submit()
  await browser.refuteText('Avocados')
  await browser.assertText('Strawberries')
})

test('search for certified products', async ({assert, browser}) => {
  await browser.visit('/products')
  const certified = await browser.find('#certified')

  await browser.assertText('Avocados')
  await browser.assertText('Strawberries')

  await certified.click()

  await browser.refuteText('Avocados')
  await browser.assertText('Strawberries')
})

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

test('edit certified', async ({assert, browser}) => {
  assert.is((await Product.find(1)).certified, false)
  await browser.signIn('admin@example.com')
  await browser.visit('/products/1/edit')
  await browser.find('#certified').click()
  await browser.find('#certified').submit()
  await browser.assertSelector('#message:not(.active)')
  assert.is((await Product.find(1)).certified, true)
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
