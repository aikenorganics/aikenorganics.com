'use strict'

const test = require('../test')
const driver = require('../driver')
const User = require('ozymandias/user')
const Token = require('ozymandias/token')

test('sign in', async (assert) => {
  await driver.visit('/session/signin')
  await driver.$('#email').sendKeys('admin@example.com')
  await driver.$('#password').sendKeys('password')
  await driver.$('#password').submit()
  await driver.wait(driver.present('#signout'))
})

test('incorrect password', async (assert) => {
  await driver.visit('/session/signin')
  await driver.$('#email').sendKeys('admin@example.com')
  await driver.$('#password').sendKeys('wrong')
  await driver.$('#password').submit()
  await driver.wait(driver.present('#errors'))
  await driver.wait(() => (
    driver.$('#errors').getText().then((text) => (
      /Sorry! That password is incorrect\./.test(text)
    ))
  ))
})

test('email not found', async (assert) => {
  await driver.visit('/session/signin')
  await driver.$('#email').sendKeys('wrong@example.com')
  await driver.$('#password').sendKeys('password')
  await driver.$('#password').submit()
  await driver.wait(driver.present('#errors'))
  await driver.wait(() => (
    driver.$('#errors').getText().then((text) => (
      /Sorry! We don’t recognize that email\./.test(text)
    ))
  ))
})

test('forgot password', async (assert) => {
  // Send Token
  await driver.visit('/session/forgot')
  await driver.$('#email').sendKeys('admin@example.com')
  await driver.$('#email').submit()

  // Wait for message
  await driver.wait(() => (
    driver.$('#message').getText().then((text) => (
      /Thanks! We sent you an email to reset your password\./.test(text)
    ))
  ))

  // Reset password
  const token = await Token.find()
  await driver.visit(`/session/reset/${token.id}`)
  await driver.$('#password').sendKeys('newpassword')
  await driver.$('#password').submit()
  await driver.wait(() => driver.getPath().then((path) => path === '/products'))

  // Verify new password
  const user = await User.find(1)
  assert.ok(await user.authenticate('newpassword'))
})

