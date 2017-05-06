'use strict'

const test = require('../test')
const browser = require('../browser')
const User = require('ozymandias/user')
const Token = require('ozymandias/token')

test('sign in', async (assert) => {
  await browser.visit('/session/signin')
  await browser.$('#email').sendKeys('admin@example.com')
  await browser.$('#password').sendKeys('password')
  await browser.$('#password').submit()
  await browser.wait(browser.present('#signout'))
})

test('incorrect password', async (assert) => {
  await browser.visit('/session/signin')
  await browser.$('#email').sendKeys('admin@example.com')
  await browser.$('#password').sendKeys('wrong')
  await browser.$('#password').submit()
  await browser.wait(browser.present('#errors'))
  await browser.wait(() => (
    browser.$('#errors').getText().then((text) => (
      /Sorry! That password is incorrect\./.test(text)
    ))
  ))
})

test('email not found', async (assert) => {
  await browser.visit('/session/signin')
  await browser.$('#email').sendKeys('wrong@example.com')
  await browser.$('#password').sendKeys('password')
  await browser.$('#password').submit()
  await browser.wait(browser.present('#errors'))
  await browser.wait(() => (
    browser.$('#errors').getText().then((text) => (
      /Sorry! We don’t recognize that email\./.test(text)
    ))
  ))
})

test('forgot password', async (assert) => {
  // Send Token
  await browser.visit('/session/forgot')
  await browser.$('#email').sendKeys('admin@example.com')
  await browser.$('#email').submit()

  // Wait for message
  await browser.wait(() => (
    browser.$('#message').getText().then((text) => (
      /Thanks! We sent you an email to reset your password\./.test(text)
    ))
  ))

  // Reset password
  const token = await Token.find()
  await browser.visit(`/session/reset/${token.id}`)
  await browser.$('#password').sendKeys('newpassword')
  await browser.$('#password').submit()
  await browser.wait(() => browser.getPath().then((path) => path === '/products'))

  // Verify new password
  const user = await User.find(1)
  assert.ok(await user.authenticate('newpassword'))
})
