'use strict'

const User = require('ozymandias/user')
const Token = require('ozymandias/token')
const test = require('../test')

test('sign in', function *(t) {
  yield t.visit('/signin')
  yield t.$('#email').sendKeys('admin@example.com')
  yield t.$('#password').sendKeys('password')
  yield t.$('#password').submit()
  yield t.wait(t.present('#signout'))
})

test('incorrect password', function *(t) {
  yield t.visit('/signin')
  yield t.$('#email').sendKeys('admin@example.com')
  yield t.$('#password').sendKeys('wrong')
  yield t.$('#password').submit()
  yield t.wait(t.present('#errors'))
  yield t.wait(() => (
    t.$('#errors').getText().then((text) => (
      /Sorry! That password is incorrect\./.test(text)
    ))
  ))
})

test('email not found', function *(t) {
  yield t.visit('/signin')
  yield t.$('#email').sendKeys('wrong@example.com')
  yield t.$('#password').sendKeys('password')
  yield t.$('#password').submit()
  yield t.wait(t.present('#errors'))
  yield t.wait(() => (
    t.$('#errors').getText().then((text) => (
      /Sorry! We don’t recognize that email\./.test(text)
    ))
  ))
})

test('forgot password', function *(t) {
  // Send Token
  yield t.visit('/signin/forgot')
  yield t.$('#email').sendKeys('admin@example.com')
  yield t.$('#email').submit()

  // Wait for message
  yield t.wait(() => (
    t.$('#message').getText().then((text) => (
      /Thanks! We sent you an email to reset your password\./.test(text)
    ))
  ))

  // Reset password
  const token = yield Token.find()
  yield t.visit(`/session/reset/${token.id}`)
  yield t.$('#password').sendKeys('newpassword')
  yield t.$('#password').submit()
  yield t.wait(() => t.getPath().then((path) => path === '/products'))

  // Verify new password
  const user = yield User.find(1)
  t.ok(yield user.authenticate('newpassword'))
})
