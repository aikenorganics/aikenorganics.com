'use strict'

const test = require('../../test')
const Market = require('../../../db/market')

test('edit news, message', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/market')

  await (await browser.find('#open-day [value="3"]')).click()
  await (await browser.find('#open-hours [value="2"]')).click()
  await (await browser.find('#open-minutes [value="23"]')).click()
  await (await browser.find('#open-meridiem [value="am"]')).click()

  await (await browser.find('#close-day [value="5"]')).click()
  await (await browser.find('#close-hours [value="1"]')).click()
  await (await browser.find('#close-minutes [value="30"]')).click()
  await (await browser.find('#close-meridiem [value="pm"]')).click()

  await (await browser.find('#news')).clear()
  await (await browser.find('#news')).sendKeys('Test News')

  await (await browser.find('#market-message')).clear()
  await (await browser.find('#market-message')).sendKeys('Test Message')
  await (await browser.find('#market-message')).submit()

  await browser.assertSelector('#message:not(.active)')

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
