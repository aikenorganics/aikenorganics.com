'use strict'

const test = require('../../test')
const driver = require('../../driver')
const Market = require('../../../db/market')

test('edit news, message', async (assert) => {
  await driver.signIn('admin@example.com')
  await driver.visit('/admin/market')

  await driver.$('#open-day [value="3"]').click()
  await driver.$('#open-hours [value="2"]').click()
  await driver.$('#open-minutes [value="23"]').click()
  await driver.$('#open-meridiem [value="am"]').click()

  await driver.$('#close-day [value="5"]').click()
  await driver.$('#close-hours [value="1"]').click()
  await driver.$('#close-minutes [value="30"]').click()
  await driver.$('#close-meridiem [value="pm"]').click()

  await driver.$('#news').clear()
  await driver.$('#news').sendKeys('Test News')

  await driver.$('#market-message').clear()
  await driver.$('#market-message').sendKeys('Test Message')
  await driver.$('#market-message').submit()

  await driver.wait(driver.present('#message:not(.active)'))

  const market = await Market.find(1)

  assert.is(market.news, 'Test News')
  assert.is(market.message, 'Test Message')

  assert.is(market.openDay, 3)
  assert.is(market.openHours, 2)
  assert.is(market.openMinutes, 23)

  assert.is(market.closeDay, 5)
  assert.is(market.closeHours, 13)
  assert.is(market.closeMinutes, 30)
})
