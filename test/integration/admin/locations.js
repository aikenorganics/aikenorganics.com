'use strict'

const test = require('../../test')
const driver = require('../../driver')
const Location = require('../../../db/location')

test('new location', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/admin/locations/new')
  await driver.$('#name').sendKeys('Test Location')
  await driver.$('#name').submit()
  await driver.wait(driver.present('#message:not(.active)'))
  assert.ok(await Location.where({name: 'Test Location'}).find())
})

test('edit a location', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/admin/locations/1/edit')
  await driver.$('#name').clear()
  await driver.$('#name').sendKeys('Test Name')
  await driver.$('#name').submit()
  await driver.wait(driver.present('#message:not(.active)'))
  const location = await Location.find(1)
  assert.is(location.name, 'Test Name')
})
