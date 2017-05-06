'use strict'

const Event = require('../../db/event')
const test = require('../test')

// Index

test('GET /growers is a 200', async (assert) => {
  const response = await assert.client.get('/growers').send()
  response.assert(200)
})

test('GET /growers is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers').send()
  response.assert(200)
})

test('GET /growers is a 200 for non-admins', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/growers').send()
  response.assert(200)
})

test('GET /growers does not return inactive growers', async (assert) => {
  const response = await assert.client
    .get('/growers')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  assert.ok(response.body.growers.every(({id}) => id !== 3))
})

// Show

test('GET /growers/:id authorized users see new product link', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.get('/growers/1').send()
  response.assert(200).assert(/\/growers\/1\/products\/new/)
})

test('GET /growers/:id is a 200', async (assert) => {
  const response = await assert.client.get('/growers/1').send()
  response.assert(200)
})

test('GET /growers/:id is a 200 as an admin', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/1').send()
  response.assert(200)
})

test('GET /growers/:id is a 200 as a grower', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.get('/growers/1').send()
  response.assert(200)
})

test('GET /growers/:id is a 404 for missing ids', async (assert) => {
  const response = await assert.client.get('/growers/123456789').send()
  response.assert(404)
})

test('GET /growers/:id is a 404 for missing ids', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/123456789').send()
  response.assert(404)
})

test('GET /growers/:id as admin includes inactive products', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client
    .get('/growers/2')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  const {products} = response.body
  assert.ok(products.some(({id}) => id === 7), 'should see inactive products')
  assert.ok(products.some(({id}) => id === 4), 'should see active products')
})

test('GET /growers/:id as grower includes inactive products', async (assert) => {
  await assert.signIn('info@planitfoods.com')
  const response = await assert.client
    .get('/growers/2')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  const {products} = response.body
  assert.ok(products.some(({id}) => id === 7), 'should see inactive products')
  assert.ok(products.some(({id}) => id === 4), 'should see active products')
})

test('GET /growers/:id as non-grower does not include inactive products', async (assert) => {
  await assert.signIn('info@planitfoods.com')
  const response = await assert.client
    .get('/growers/1')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  const {products} = response.body
  assert.ok(products.every(({id}) => id !== 8), 'should not see inactive products')
  assert.ok(products.some(({id}) => id === 1), 'should see active products')
})

// New

test('GET /growers/new is a 200 as an admin', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/new').send()
  response.assert(200)
})

test('GET /growers/new is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/new').send()
  response.assert(200)
})

test('GET /growers/new is a 401 as a non-admin', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/growers/new').send()
  response.assert(401)
})

// Edit

test('GET /growers/:id/edit is a 401 for non-admins', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/growers/1/edit').send()
  response.assert(401)
})

test('GET /growers/:id/edit is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/1/edit').send()
  response.assert(200)
})

test('GET /growers/:id/edit is a 200 for allowed users', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.get('/growers/1/edit').send()
  response.assert(200)
})

// Orders

test('GET /growers/:id/orders is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/1/orders').send()
  response.assert(200)
})

test('GET /growers/:id/orders is a 200 for allowed users', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.get('/growers/1/orders').send()
  response.assert(200)
})

test('GET /growers/:id/orders is a 401 for non-admins', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.get('/growers/2/orders').send()
  response.assert(401)
})

test('GET /growers/:id/orders is a 401 for non-admins', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/growers/1/orders').send()
  response.assert(401)
})

// Update

test('POST /growers/:id is a 401 for non-admins', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.post('/growers/1').send()
  response.assert(401)
})

test('POST /growers/:id is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.post('/growers/1').send({name: 'Watsonia'})
  response.assert(200).assert('content-type', /json/)
})

test('POST /growers/:id is a 200 for allowed users', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.post('/growers/1').send({name: 'Watsonia'})
  response.assert(200).assert('content-type', /json/)
})

test('updating creates an event', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.post('/growers/1').send({name: 'Test'})
  response.assert(200)
  const event = await Event.where({growerId: 1}).find()
  assert.deepEqual(event.meta, {name: 'Test'})
  assert.is(event.userId, 5)
  assert.is(event.action, 'update')
  assert.is(event.growerId, 1)
  assert.is(event.productId, null)
})

// Create

test('POST /growers is a 401 for non-admins', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.post('/growers').send({name: 'New Grower'})
  response.assert(401)
})

test('POST /growers is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.post('/growers').send({name: 'New Grower'})
  response.assert(200).assert('content-type', /json/)
  const {id, name} = response.body.grower
  assert.is(name, 'New Grower')
  assert.is(typeof id, 'number')
})

// Create Product

test('POST /growers/:id/products is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: '2.45',
    supply: 32,
    categoryId: 1
  })
  response.assert(200).assert('Content-Type', /json/)
  const {categoryId, cost, growerId, id, name, supply} = response.body.product
  assert.is(categoryId, 1)
  assert.is(cost, '2.45')
  assert.is(growerId, 1)
  assert.is(name, 'New Product')
  assert.is(supply, 32)
  assert.is(typeof id, 'number')
})

test('POST /growers/:id/products is a 401 for non-admins', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: '2.45',
    supply: 32,
    categoryId: 1
  })
  response.assert(401)
})

test('POST /growers/:id/products is a 200 if allowed', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.post('/growers/1/products').send({
    categoryId: 1,
    cost: '2.50',
    featured: true,
    name: 'New Product',
    supply: 23
  })
  response.assert(200)
  const {categoryId, cost, featured, name, supply} = response.body.product
  assert.is(categoryId, 1)
  assert.is(cost, '2.50')
  assert.is(featured, false)
  assert.is(name, 'New Product')
  assert.is(supply, 23)
})

test('POST /growers/:id/products is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: '2.50',
    supply: 23,
    categoryId: 1,
    featured: true
  })
  response.assert(200)
  const {categoryId, cost, featured, name, supply} = response.body.product
  assert.is(categoryId, 1)
  assert.is(cost, '2.50')
  assert.is(featured, true)
  assert.is(name, 'New Product')
  assert.is(supply, 23)
})

test('POST /growers/:id/products is a 422 for invalid data', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: 'asdf',
    supply: 23,
    categoryId: 1
  })
  response.assert(422)
})

// New Product

test('GET /growers/:id/products/new is a 401 as a non-admin', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/growers/1/products/new').send()
  response.assert(401)
})

test('GET /growers/:id/products/new is a 200 as an admin', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/1/products/new').send()
  response.assert(200)
})

test('GET /growers/:id/products/new is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/1/products/new').send()
  response.assert(200)
})

test('GET /growers/:id/products/new is a 200 for allowed users', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.get('/growers/1/products/new').send()
  response.assert(200)
})

test('GET /growers/:id/products/new is a 401 for non-admins', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/growers/1/products/new').send()
  response.assert(401)
})

// Products

test('GET /growers/:id/products is a 200 for admins', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/growers/1/products').send()
  response.assert(200)
})

test('GET /growers/:id/products is a 200 for allowed users', async (assert) => {
  await assert.signIn('grower@example.com')
  const response = await assert.client.get('/growers/1/products').send()
  response.assert(200)
})

test('GET /growers/:id/products is a 401 for non-growers', async (assert) => {
  await assert.signIn('info@planitfoods.com')
  const response = await assert.client.get('/growers/1/products').send()
  response.assert(401)
})
