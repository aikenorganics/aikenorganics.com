'use strict'

const test = require('../test')

test('sign in', (t) => {
  t.visit('/auth/signin')
  t.$('[name=email]').sendKeys('admin@example.com')
  t.$('[name=password]').sendKeys('password' + t.Key.RETURN)
  t.until.stalenessOf(t.$('html'))
  Promise.all([
    t.getPath(),
    t.$('#current-user').getInnerHtml()
  ]).then((results) => {
    t.is(results[0], '/')
    t.ok(/admin@example.com/.test(results[1]))
    t.end()
  })
})
