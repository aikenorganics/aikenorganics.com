'use strict'

let db = require('../../db')
let test = require('../test')

test('User#name combines first and last', function (t) {
  let user = new db.User({
    first: 'Steven',
    last: 'Tyler'
  })
  t.is(user.name(), 'Steven Tyler')
  t.end()
})

test('User#name is trimmed', function (t) {
  let user = new db.User({})
  t.is(user.name(), '')
  t.end()
})

test('User#member_until is null for empty values', function (t) {
  let user = new db.User({member_until: ''})
  t.is(user.member_until, null)
  user.member_until = 0
  t.is(user.member_until, null)
  user.member_until = undefined
  t.is(user.member_until, null)
  t.end()
})
