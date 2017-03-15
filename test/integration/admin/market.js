'use strict'

const test = require('../../test')
const driver = require('../../driver')
const Market = require('../../../db/market')

test('edit news, message', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/admin/market')
  await driver.$('#news').clear()
  await driver.$('#news').sendKeys('Test News')
  await driver.$('#market-message').clear()
  await driver.$('#market-message').sendKeys('Test Message')
  await driver.$('#market-message').submit()
  await driver.wait(driver.present('#message:not(.active)'))
  const market = await Market.find(1)
  assert.is(market.news, 'Test News')
  assert.is(market.message, 'Test Message')
})
