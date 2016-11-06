'use strict'

const test = require('../test')
const driver = require('../driver')
const User = require('ozymandias/user')
const Token = require('ozymandias/token')

test('sign in', function *(assert) {
  yield driver.visit('/session/signin')
  yield driver.$('#email').sendKeys('admin@example.com')
  yield driver.$('#password').sendKeys('password')
  yield driver.$('#password').submit()
  yield driver.wait(driver.present('#signout'))
})

test('incorrect password', function *(assert) {
  yield driver.visit('/session/signin')
  yield driver.$('#email').sendKeys('admin@example.com')
  yield driver.$('#password').sendKeys('wrong')
  yield driver.$('#password').submit()
  yield driver.wait(driver.present('#errors'))
  yield driver.wait(() => (
    driver.$('#errors').getText().then((text) => (
      /Sorry! That password is incorrect\./.test(text)
    ))
  ))
})

test('email not found', function *(assert) {
  yield driver.visit('/session/signin')
  yield driver.$('#email').sendKeys('wrong@example.com')
  yield driver.$('#password').sendKeys('password')
  yield driver.$('#password').submit()
  yield driver.wait(driver.present('#errors'))
  yield driver.wait(() => (
    driver.$('#errors').getText().then((text) => (
      /Sorry! We don’t recognize that email\./.test(text)
    ))
  ))
})

test('forgot password', function *(assert) {
  // Send Token
  yield driver.visit('/session/forgot')
  yield driver.$('#email').sendKeys('admin@example.com')
  yield driver.$('#email').submit()

  // Wait for message
  yield driver.wait(() => (
    driver.$('#message').getText().then((text) => (
      /Thanks! We sent you an email to reset your password\./.test(text)
    ))
  ))

  // Reset password
  const token = yield Token.find()
  yield driver.visit(`/session/reset/${token.id}`)
  yield driver.$('#password').sendKeys('newpassword')
  yield driver.$('#password').submit()
  yield driver.wait(() => driver.getPath().then((path) => path === '/products'))

  // Verify new password
  const user = yield User.find(1)
  assert.ok(yield user.authenticate('newpassword'))
})

