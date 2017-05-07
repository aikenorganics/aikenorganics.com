'use strict'

const test = require('../../test')
const Category = require('../../../db/category')

test('new category', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/categories/new')
  await browser.find('#name').sendKeys('Test Category')
  await browser.find('#position').sendKeys('12345')
  await browser.find('#meat').click()
  await browser.find('#meat').submit()
  await browser.assertSelector('#message:not(.active)')
  const category = await Category.where({position: 12345}).find()
  assert.is(category.name, 'Test Category')
  assert.is(category.position, 12345)
  assert.is(category.meat, true)
})

test('edit a category', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/categories/1/edit')
  await browser.find('#name').clear()
  await browser.find('#name').sendKeys('Test Name')
  await browser.find('#position').clear()
  await browser.find('#position').sendKeys('12345')
  await browser.find('#meat').click()
  await browser.find('#meat').submit()
  await browser.assertSelector('#message:not(.active)')
  const category = await Category.find(1)
  assert.is(category.name, 'Test Name')
  assert.is(category.position, 12345)
  assert.is(category.meat, true)
})
