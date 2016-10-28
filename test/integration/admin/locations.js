'use strict'

const test = require('../../test')
const driver = require('../../driver')
const Location = require('../../../db/location')

test('new location', function *(assert) {
  yield driver.signIn('admin@example.com')
  yield driver.visit('/admin/locations/new')
  yield driver.$('#name').sendKeys('Test Location')
  yield driver.$('#name').submit()
  yield driver.wait(driver.present('#message:not(.active)'))
  assert.ok(yield Location.where({name: 'Test Location'}).find())
})

test('edit a location', function *(assert) {
  yield driver.signIn('admin@example.com')
  yield driver.visit('/admin/locations/1/edit')
  yield driver.$('#name').clear()
  yield driver.$('#name').sendKeys('Test Name')
  yield driver.$('#name').submit()
  yield driver.wait(driver.present('#message:not(.active)'))
  const location = yield Location.find(1)
  assert.is(location.name, 'Test Name')
})
