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

test('User#is_admin accepts falsy/truthy strings', function (t) {
  let user = new db.User({is_admin: 0})
  t.is(user.is_admin, false)
  user.is_admin = 1
  t.is(user.is_admin, true)
  user.is_admin = '0'
  t.is(user.is_admin, false)
  user.is_admin = '1'
  t.is(user.is_admin, true)
  user.is_admin = true
  t.is(user.is_admin, true)
  user.is_admin = false
  t.is(user.is_admin, false)
  t.end()
})
