'use strict'

const test = require('../../test')
const Market = require('../../../db/market')

test('edit news, message', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/market')

  await browser.$('#open-day [value="3"]').click()
  await browser.$('#open-hours [value="2"]').click()
  await browser.$('#open-minutes [value="23"]').click()
  await browser.$('#open-meridiem [value="am"]').click()

  await browser.$('#close-day [value="5"]').click()
  await browser.$('#close-hours [value="1"]').click()
  await browser.$('#close-minutes [value="30"]').click()
  await browser.$('#close-meridiem [value="pm"]').click()

  await browser.$('#news').clear()
  await browser.$('#news').sendKeys('Test News')

  await browser.$('#market-message').clear()
  await browser.$('#market-message').sendKeys('Test Message')
  await browser.$('#market-message').submit()

  await browser.wait(browser.present('#message:not(.active)'))

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
