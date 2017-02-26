'use strict'

const db = require('../../db')
const test = require('../test')

test('User#name combines first and last', async (t) => {
  const user = new db.User({
    first: 'Steven',
    last: 'Tyler'
  })
  t.is(user.name, 'Steven Tyler')
})

test('User#name is trimmed', async (t) => {
  const user = new db.User({})
  t.is(user.name, '')
})

test('User#memberUntil is null for empty values', async (t) => {
  const user = new db.User({memberUntil: ''})
  t.is(user.memberUntil, null)
  user.memberUntil = 0
  t.is(user.memberUntil, null)
  user.memberUntil = undefined
  t.is(user.memberUntil, null)
})

test('trim street', async (t) => {
  const user = new db.User()
  user.street = '  test  '
  t.is(user.street, 'test')
})

test('validate street', async (t) => {
  const user = new db.User({street: null})
  user.validate()
  t.is(user.errors.street, undefined)

  user.street = ''
  user.validate()
  t.deepEqual(user.errors.street, ['Street cannot be blank'])

  user.street = '   '
  user.validate()
  t.deepEqual(user.errors.street, ['Street cannot be blank'])

  user.street = '123 street drive'
  user.validate()
  t.is(user.errors.street, undefined)
})

test('trim city', async (t) => {
  const user = new db.User()
  user.city = '  test  '
  t.is(user.city, 'test')
})

test('validate city', async (t) => {
  const user = new db.User({city: null})
  user.validate()
  t.is(user.errors.city, undefined)

  user.city = ''
  user.validate()
  t.deepEqual(user.errors.city, ['City cannot be blank'])

  user.city = '   '
  user.validate()
  t.deepEqual(user.errors.city, ['City cannot be blank'])

  user.city = 'Lexington'
  user.validate()
  t.is(user.errors.city, undefined)
})

test('trim and capitalize state', async (t) => {
  const user = new db.User({state: '  sc '})
  t.is(user.state, 'SC')
})

test('validate state', async (t) => {
  const user = new db.User({state: null})
  user.validate()
  t.is(user.errors.state, undefined)

  user.state = ''
  user.validate()
  t.deepEqual(user.errors.state, ['State must be two letters'])

  user.state = ' '
  user.validate()
  t.deepEqual(user.errors.state, ['State must be two letters'])

  user.state = 'sc'
  user.validate()
  t.is(user.errors.state, undefined)
})

test('trim zip', async (t) => {
  const user = new db.User({zip: ' 12345 '})
  t.is(user.zip, '12345')
})

test('validate zip', async (t) => {
  const user = new db.User({zip: null})
  user.validate()
  t.is(user.errors.zip, undefined)

  user.zip = ''
  user.validate()
  t.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = ' '
  user.validate()
  t.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '1234'
  user.validate()
  t.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '12345-'
  user.validate()
  t.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '12345'
  user.validate()
  t.is(user.errors.zip, undefined)

  user.zip = '12345-1234'
  user.validate()
  t.is(user.errors.zip, undefined)
})

test('canDeliver', async (t) => {
  const user = new db.User({
    phone: '555.555.5555',
    street: '123 Street Drive',
    city: 'Townsville',
    state: 'SC',
    stripeId: '12345',
    zip: '12345'
  })
  t.is(user.canDeliver, true)

  user.zip = null
  t.is(user.canDeliver, false)
})

test('address', async (t) => {
  const user = new db.User({
    street: '123 Street Drive',
    city: 'Townsville',
    state: 'SC',
    zip: '12345'
  })

  t.is(user.address, '123 Street Drive, Townsville SC 12345')

  user.zip = null
  t.is(user.address, null)
})

test('validate email', async (t) => {
  const user = new db.User()

  user.email = 'foo'
  user.validate()
  t.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = ' '
  user.validate()
  t.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = 'foo@'
  user.validate()
  t.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = 'foo@bar'
  user.validate()
  t.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = '@bar.com'
  user.validate()
  t.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = 'foo@bar.com'
  user.validate()
  t.is(user.errors.email, undefined)
})
