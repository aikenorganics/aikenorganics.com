'use strict'

const db = require('../../db')
const test = require('../test')

test('User#name combines first and last', (t) => {
  const user = new db.User({
    first: 'Steven',
    last: 'Tyler'
  })
  t.is(user.name, 'Steven Tyler')
  t.end()
})

test('User#name is trimmed', (t) => {
  const user = new db.User({})
  t.is(user.name, '')
  t.end()
})

test('User#member_until is null for empty values', (t) => {
  const user = new db.User({member_until: ''})
  t.is(user.member_until, null)
  user.member_until = 0
  t.is(user.member_until, null)
  user.member_until = undefined
  t.is(user.member_until, null)
  t.end()
})

test('User#is_admin accepts falsy/truthy strings', (t) => {
  const user = new db.User({is_admin: 0})
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

test('trim street', (t) => {
  const user = new db.User()
  user.street = '  test  '
  t.is(user.street, 'test')
  t.end()
})

test('validate street', (t) => {
  const user = new db.User({street: null})
  t.ok(user.valid)

  user.street = ''
  t.ok(!user.valid)
  t.deepEqual(user.errors.street, ['Street cannot be blank'])

  user.street = '   '
  t.ok(!user.valid)
  t.deepEqual(user.errors.street, ['Street cannot be blank'])

  user.street = '123 street drive'
  t.ok(user.valid)

  t.end()
})

test('trim city', (t) => {
  const user = new db.User()
  user.city = '  test  '
  t.is(user.city, 'test')
  t.end()
})

test('validate city', (t) => {
  const user = new db.User({city: null})
  t.ok(user.valid)

  user.city = ''
  t.ok(!user.valid)
  t.deepEqual(user.errors.city, ['City cannot be blank'])

  user.city = '   '
  t.ok(!user.valid)
  t.deepEqual(user.errors.city, ['City cannot be blank'])

  user.city = 'Lexington'
  t.ok(user.valid)

  t.end()
})

test('trim and capitalize state', (t) => {
  const user = new db.User({state: '  sc '})
  t.is(user.state, 'SC')
  t.end()
})

test('validate state', (t) => {
  const user = new db.User({state: null})
  t.ok(user.valid)

  user.state = ''
  t.ok(!user.valid)
  t.deepEqual(user.errors.state, ['State must be two letters'])

  user.state = ' '
  t.ok(!user.valid)
  t.deepEqual(user.errors.state, ['State must be two letters'])

  user.state = 'sc'
  t.ok(user.valid)

  t.end()
})

test('trim zip', (t) => {
  const user = new db.User({zip: ' 12345 '})
  t.is(user.zip, '12345')
  t.end()
})

test('validate zip', (t) => {
  const user = new db.User({zip: null})
  t.ok(user.valid)

  user.zip = ''
  t.ok(!user.valid)
  t.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = ' '
  t.ok(!user.valid)
  t.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '1234'
  t.ok(!user.valid)
  t.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '12345-'
  t.ok(!user.valid)
  t.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '12345'
  t.ok(user.valid)

  user.zip = '12345-1234'
  t.ok(user.valid)

  t.end()
})

test('canDeliver', (t) => {
  const user = new db.User({
    phone: '555.555.5555',
    street: '123 Street Drive',
    city: 'Townsville',
    state: 'SC',
    stripe_id: '12345',
    zip: '12345'
  })
  t.is(user.canDeliver, true)

  user.zip = null
  t.is(user.canDeliver, false)

  t.end()
})

test('address', (t) => {
  const user = new db.User({
    street: '123 Street Drive',
    city: 'Townsville',
    state: 'SC',
    zip: '12345'
  })

  t.is(user.address, '123 Street Drive, Townsville SC 12345')

  user.zip = null
  t.is(user.address, null)

  t.end()
})
