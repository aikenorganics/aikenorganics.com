'use strict'

const {Order, User} = require('../../../db')
const test = require('../../test')

test('POST /admin/users/:id is a 200', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client
    .post('/admin/users/2')
    .send({
      first: 'first',
      last: 'last',
      phone: '555-555-5555'
    })
  response.assert(200)

  const {first, last, phone} = response.body.user
  assert.is(first, 'first')
  assert.is(last, 'last')
  assert.is(phone, '555-555-5555')

  const user = await User.find(2)
  assert.is(user.first, 'first')
  assert.is(user.last, 'last')
  assert.is(user.phone, '555-555-5555')
})

test('GET /admin/users is a 200 as an admin', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/admin/users').send()
  response.assert(200)
})

test('GET /admin/users is a 200 as an admin with a search', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/admin/users?search=admin').send()
  response.assert(200)
})

test('GET /admin/users/show is a 200 as an admin', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/admin/users/1/edit').send()
  response.assert(200).assert(/isAdmin/)
})

test('missing users are a 404 as an admin', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/admin/users/123456789').send()
  response.assert(404)
})

test('GET /admin/users is a 401 as a regular user', async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.get('/admin/users').send()
  response.assert(401)
})

test('GET /admin/users/show is a 401 as a regular user', async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.get('/admin/users/1/edit').send()
  response.assert(401)
})

test('GET /admin/users/emails is a 200', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/admin/users/emails').send()
  response.assert(200)
})

test('Search for stop word', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/admin/users?search=with').send()
  response.assert(200).assert(/jwitherow@example\.com/i)
})

test('Search for joanne', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/admin/users?search=joanne').send()
  response.assert(200).assert(/jwitherow@example\.com/i)
})

test('Delete a user', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.delete('/admin/users/7').send()
  response.assert(200)
  const user = await User.find(7)
  assert.ok(user == null)
})

test('/admin/users/new is a 200', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/admin/users/new').send()
  response.assert(200)
})

test('POST /admin/users is a 200', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client
    .post('/admin/users')
    .send({
      email: 'new@example.com',
      first: 'first',
      last: 'last',
      phone: '555-555-5555'
    })
  response.assert(200)
  const user = await User.where({email: 'new@example.com'}).find()
  assert.is(user.password, null)
  assert.is(user.email, 'new@example.com')
  assert.is(user.first, 'first')
  assert.is(user.last, 'last')
  assert.is(user.phone, '555-555-5555')
})

test('return page in JSON', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client
    .get('/admin/users')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  assert.is(response.body.page, 1)
})

test('find an open order', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client
    .post('/admin/users/2/order')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  const {order} = response.body
  assert.is(order.id, 2)
  assert.is(order.userId, 2)
})

test('create an order', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const orders = await Order.all()
  const response = await client
    .post('/admin/users/4/order')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  const {order} = response.body
  assert.is(order.userId, 4)
  assert.ok(!orders.map(({id}) => id).includes(order.id))
})

test('creating a user with an existing email returns 422', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client
    .post('/admin/users')
    .set('accept', 'application/json')
    .send({email: 'admin@example.com'})
  response.assert(422, {email: ['A user with that email already exists.']})
})

test('updating a user with an existing email returns 422', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client
    .post('/admin/users/1')
    .set('accept', 'application/json')
    .send({email: 'finn@example.com'})
  response.assert(422, {email: ['A user with that email already exists.']})
})
