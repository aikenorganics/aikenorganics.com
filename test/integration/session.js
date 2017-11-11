'use strict'

const test = require('../test')
const User = require('ozymandias/user')
const Token = require('ozymandias/token')

test('sign in', async ({assert, browser}) => {
  await browser.visit('/session/signin')
  await (await browser.find('#email')).sendKeys('admin@example.com')
  await (await browser.find('#password')).sendKeys('secret')
  await (await browser.find('#password')).submit()
  await browser.assertSelector('#signout')
})

test('incorrect password', async ({assert, browser}) => {
  await browser.visit('/session/signin')
  await (await browser.find('#email')).sendKeys('admin@example.com')
  await (await browser.find('#password')).sendKeys('wrong')
  await (await browser.find('#password')).submit()
  await browser.assertSelector('#errors', {text: /Sorry! That password is incorrect\./})
})

test('email not found', async ({assert, browser}) => {
  await browser.visit('/session/signin')
  await (await browser.find('#email')).sendKeys('wrong@example.com')
  await (await browser.find('#password')).sendKeys('secret')
  await (await browser.find('#password')).submit()
  await browser.assertSelector('#errors', {text: /Sorry! We don’t recognize that email\./})
})

test('forgot password', async ({assert, browser}) => {
  // Send Token
  await browser.visit('/session/forgot')
  await (await browser.find('#email')).sendKeys('admin@example.com')
  await (await browser.find('#email')).submit()

  // Wait for message
  await browser.assertSelector('#message', {text: /Thanks! We sent you an email to reset your password\./})

  // Reset password
  const token = await Token.find()
  await browser.visit(`/session/reset/${token.id}`)
  await (await browser.find('#password')).sendKeys('newpassword')
  await (await browser.find('#password')).submit()
  await browser.assertUrl('/products')

  // Verify new password
  const user = await User.find(1)
  assert.ok(await user.authenticate('newpassword'))
})
