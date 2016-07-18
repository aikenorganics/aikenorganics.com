'use strict'

const db = require('../../db')
const test = require('../test')

test('sign in', (t) => {
  t.visit('/signin')
  t.$('#email').sendKeys('admin@example.com')
  t.$('#password').sendKeys('password')
  t.$('#password').submit()
  t.wait(() => (
    t.$('#current-user').getInnerHtml().then((html) => (
      /admin@example.com/.test(html)
    ))
  ))
  .then(() => t.end())
  .catch(t.end)
})

test('incorrect password', (t) => {
  t.visit('/signin')
  t.$('#email').sendKeys('admin@example.com')
  t.$('#password').sendKeys('wrong')
  t.$('#password').submit()
  t.wait(() => (
    t.$('#errors').getText().then((text) => (
      /Sorry! That password is incorrect\./.test(text)
    ))
  ))
  .then(() => t.end())
  .catch(t.end)
})

test('email not found', (t) => {
  t.visit('/signin')
  t.$('#email').sendKeys('wrong@example.com')
  t.$('#password').sendKeys('password')
  t.$('#password').submit()
  t.wait(() => (
    t.$('#errors').getText().then((text) => (
      /Sorry! We don’t recognize that email\./.test(text)
    ))
  ))
  .then(() => t.end())
  .catch(t.end)
})

test('forgot password', (t) => {
  // Send Token
  t.visit('/signin/forgot')
  t.$('#email').sendKeys('admin@example.com')
  t.$('#email').submit()

  // Wait for message
  t.wait(() => (
    t.$('#message').getText().then((text) => (
      /Thanks! We sent you an email to reset your password\./.test(text)
    ))
  ))

  // Reset password
  .then(() => (
    db.Token.find().then((token) => {
      t.visit(`/signin/reset/${token.id}`)
      t.$('#password').sendKeys('newpassword')
      t.$('#password').submit()
      return t.wait(() => t.getPath().then((path) => path === '/products'))
    })
  ))

  // Verify new password
  .then(() => db.User.find(1)).then((user) => (
    user.authenticate('newpassword').then((match) => {
      t.ok(match)
      t.end()
    })
  ))
  .catch(t.end)
})
