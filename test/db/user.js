'use strict'

const db = require('../../db')
const test = require('../test')

test('User#name combines first and last', async (assert) => {
  const user = new db.User({
    first: 'Steven',
    last: 'Tyler'
  })
  assert.is(user.name, 'Steven Tyler')
})

test('User#name is trimmed', async (assert) => {
  const user = new db.User({})
  assert.is(user.name, '')
})

test('User#memberUntil is null for empty values', async (assert) => {
  const user = new db.User({memberUntil: ''})
  assert.is(user.memberUntil, null)
  user.memberUntil = 0
  assert.is(user.memberUntil, null)
  user.memberUntil = undefined
  assert.is(user.memberUntil, null)
})

test('trim street', async (assert) => {
  const user = new db.User()
  user.street = '  test  '
  assert.is(user.street, 'test')
})

test('validate street', async (assert) => {
  const user = new db.User({street: null})
  user.validate()
  assert.is(user.errors.street, undefined)

  user.street = ''
  user.validate()
  assert.deepEqual(user.errors.street, ['Street cannot be blank'])

  user.street = '   '
  user.validate()
  assert.deepEqual(user.errors.street, ['Street cannot be blank'])

  user.street = '123 street drive'
  user.validate()
  assert.is(user.errors.street, undefined)
})

test('trim city', async (assert) => {
  const user = new db.User()
  user.city = '  test  '
  assert.is(user.city, 'test')
})

test('validate city', async (assert) => {
  const user = new db.User({city: null})
  user.validate()
  assert.is(user.errors.city, undefined)

  user.city = ''
  user.validate()
  assert.deepEqual(user.errors.city, ['City cannot be blank'])

  user.city = '   '
  user.validate()
  assert.deepEqual(user.errors.city, ['City cannot be blank'])

  user.city = 'Lexington'
  user.validate()
  assert.is(user.errors.city, undefined)
})

test('trim and capitalize state', async (assert) => {
  const user = new db.User({state: '  sc '})
  assert.is(user.state, 'SC')
})

test('validate state', async (assert) => {
  const user = new db.User({state: null})
  user.validate()
  assert.is(user.errors.state, undefined)

  user.state = ''
  user.validate()
  assert.deepEqual(user.errors.state, ['State must be two letters'])

  user.state = ' '
  user.validate()
  assert.deepEqual(user.errors.state, ['State must be two letters'])

  user.state = 'sc'
  user.validate()
  assert.is(user.errors.state, undefined)
})

test('trim zip', async (assert) => {
  const user = new db.User({zip: ' 12345 '})
  assert.is(user.zip, '12345')
})

test('validate zip', async (assert) => {
  const user = new db.User({zip: null})
  user.validate()
  assert.is(user.errors.zip, undefined)

  user.zip = ''
  user.validate()
  assert.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = ' '
  user.validate()
  assert.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '1234'
  user.validate()
  assert.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '12345-'
  user.validate()
  assert.deepEqual(user.errors.zip, ['Zip must be valid (12345 or 12345-1234)'])

  user.zip = '12345'
  user.validate()
  assert.is(user.errors.zip, undefined)

  user.zip = '12345-1234'
  user.validate()
  assert.is(user.errors.zip, undefined)
})

test('canDeliver', async (assert) => {
  const user = new db.User({
    phone: '555.555.5555',
    street: '123 Street Drive',
    city: 'Townsville',
    state: 'SC',
    stripeId: '12345',
    zip: '12345'
  })
  assert.is(user.canDeliver, true)

  user.zip = null
  assert.is(user.canDeliver, false)
})

test('address', async (assert) => {
  const user = new db.User({
    street: '123 Street Drive',
    city: 'Townsville',
    state: 'SC',
    zip: '12345'
  })

  assert.is(user.address, '123 Street Drive, Townsville SC 12345')

  user.zip = null
  assert.is(user.address, null)
})

test('validate email', async (assert) => {
  const user = new db.User()

  user.email = 'foo'
  user.validate()
  assert.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = ' '
  user.validate()
  assert.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = 'foo@'
  user.validate()
  assert.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = 'foo@bar'
  user.validate()
  assert.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = '@bar.com'
  user.validate()
  assert.deepEqual(user.errors.email, ['Invalid Email'])

  user.email = 'foo@bar.com'
  user.validate()
  assert.is(user.errors.email, undefined)
})
