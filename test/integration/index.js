'use strict'

const db = require('../../db')
const test = require('../test')

test('sign in', (t) => {
  t.visit('/auth/signin')
  t.$('[name=email]').sendKeys('admin@example.com')
  t.$('[name=password]').sendKeys('password')
  t.$('[name=password]').submit().then(() => {
    return Promise.all([
      t.getPath(),
      t.$('#current-user').getInnerHtml()
    ]).then((results) => {
      t.is(results[0], '/')
      t.ok(/admin@example.com/.test(results[1]))
      t.end()
    })
  }, t.end)
})

test('incorrect password', (t) => {
  t.visit('/auth/signin')
  t.$('[name=email]').sendKeys('admin@example.com')
  t.$('[name=password]').sendKeys('wrong')
  t.$('[name=password]').submit().then(() => {
    return Promise.all([
      t.getPath(),
      t.$('#error').getText()
    ]).then((results) => {
      t.is(results[0], '/auth/signin')
      t.is(results[1], 'Sorry! That password is incorrect.')
      t.end()
    })
  }, t.end)
})

test('email not found', (t) => {
  t.visit('/auth/signin')
  t.$('[name=email]').sendKeys('nobody@example.com')
  t.$('[name=password]').sendKeys('password')
  t.$('[name=password]').submit().then(() => {
    return Promise.all([
      t.getPath(),
      t.$('#error').getText()
    ]).then((results) => {
      t.is(results[0], '/auth/signin')
      t.is(results[1], 'Sorry! We don’t recognize that email.')
      t.end()
    })
  }, t.end)
})

test('forgot password', (t) => {
  t.visit('/auth/forgot')
  t.$('[name=email]').sendKeys('admin@example.com')
  t.$('[name=email]').submit().then(() => {
    return Promise.all([
      t.getPath(),
      db.Token.find()
    ]).then((results) => {
      t.is(results[0], '/auth/signin')
      t.visit(`/auth/reset/${results[1].id}`)
      t.$('[name=password]').sendKeys('newpassword')
      t.$('[name=password]').submit().then(() => {
        return db.User.find(1).then((user) => {
          return user.authenticate('newpassword').then((match) => {
            t.ok(match)
            t.end()
          })
        })
      })
    })
  }, t.end)
})
