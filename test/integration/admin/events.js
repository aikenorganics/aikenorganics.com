'use strict'

const test = require('../../test')

test('/admin/events - choose a user', async ({assert, browser}) => {
  await browser.signIn('admin@example.com')
  await browser.visit('/admin/events')
  await browser.find('#userId option[value="1"]').click()
  await browser.assertUrl('/admin/events?userId=1')
  await browser.find('#userId option[value=""]').click()
  await browser.assertUrl('/admin/events')
})
