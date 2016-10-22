'use strict'

const Event = require('../../db/event')
const test = require('../test')

// Index

test('GET /growers is a 200', function *(t) {
  const response = yield t.client.get('/growers').send()
  response.assert(200)
})

test('GET /growers is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers').send()
  response.assert(200)
})

test('GET /growers is a 200 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers').send()
  response.assert(200)
})

test('GET /growers does not return inactive growers', function *(t) {
  const response = yield t.client
    .get('/growers')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  t.ok(response.body.growers.every(({id}) => id !== 3))
})

// Show

test('GET /growers/:id authorized users see new product link', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1').send()
  response.assert(200).assert(/\/growers\/1\/products\/new/)
})

test('GET /growers/:id is a 200', function *(t) {
  const response = yield t.client.get('/growers/1').send()
  response.assert(200)
})

test('GET /growers/:id is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1').send()
  response.assert(200)
})

test('GET /growers/:id is a 200 as a grower', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1').send()
  response.assert(200)
})

test('GET /growers/:id is a 404 for missing ids', function *(t) {
  const response = yield t.client.get('/growers/123456789').send()
  response.assert(404)
})

test('GET /growers/:id is a 404 for missing ids', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/123456789').send()
  response.assert(404)
})

test('GET /growers/:id as admin includes inactive products', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .get('/growers/2')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  const {products} = response.body
  t.ok(products.some(({id}) => id === 7), 'should see inactive products')
  t.ok(products.some(({id}) => id === 4), 'should see active products')
})

test('GET /growers/:id as grower includes inactive products', function *(t) {
  yield t.signIn('info@planitfoods.com')
  const response = yield t.client
    .get('/growers/2')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  const {products} = response.body
  t.ok(products.some(({id}) => id === 7), 'should see inactive products')
  t.ok(products.some(({id}) => id === 4), 'should see active products')
})

test('GET /growers/:id as non-grower does not include inactive products', function *(t) {
  yield t.signIn('info@planitfoods.com')
  const response = yield t.client
    .get('/growers/1')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  const {products} = response.body
  t.ok(products.every(({id}) => id !== 8), 'should not see inactive products')
  t.ok(products.some(({id}) => id === 1), 'should see active products')
})

// New

test('GET /growers/new is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/new').send()
  response.assert(200)
})

test('GET /growers/new is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/new').send()
  response.assert(200)
})

test('GET /growers/new is a 401 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/new').send()
  response.assert(401)
})

// Edit

test('GET /growers/:id/edit is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/1/edit').send()
  response.assert(401)
})

test('GET /growers/:id/edit is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/edit').send()
  response.assert(200)
})

test('GET /growers/:id/edit is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1/edit').send()
  response.assert(200)
})

// Orders

test('GET /growers/:id/orders is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/orders').send()
  response.assert(200)
})

test('GET /growers/:id/orders is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1/orders').send()
  response.assert(200)
})

test('GET /growers/:id/orders is a 401 for non-admins', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/2/orders').send()
  response.assert(401)
})

test('GET /growers/:id/orders is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/1/orders').send()
  response.assert(401)
})

// Update

test('POST /growers/:id is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/growers/1').send()
  response.assert(401)
})

test('POST /growers/:id is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/growers/1').send({name: 'Watsonia'})
  response.assert(200).assert('content-type', /json/)
})

test('POST /growers/:id is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.post('/growers/1').send({name: 'Watsonia'})
  response.assert(200).assert('content-type', /json/)
})

test('updating creates an event', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.post('/growers/1').send({name: 'Test'})
  response.assert(200)
  const event = yield Event.where({growerId: 1}).find()
  t.deepEqual(event.meta, {name: 'Test'})
  t.is(event.userId, 5)
  t.is(event.action, 'update')
  t.is(event.growerId, 1)
  t.is(event.productId, null)
})

// Create

test('POST /growers is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/growers').send({name: 'New Grower'})
  response.assert(401)
})

test('POST /growers is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/growers').send({name: 'New Grower'})
  response.assert(200).assert('content-type', /json/)
  const {id, name} = response.body.grower
  t.is(name, 'New Grower')
  t.is(typeof id, 'number')
})

// Create Product

test('POST /growers/:id/products is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: '2.45',
    supply: 32,
    categoryId: 1
  })
  response.assert(200).assert('Content-Type', /json/)
  const {categoryId, cost, growerId, id, name, supply} = response.body.product
  t.is(categoryId, 1)
  t.is(cost, '2.45')
  t.is(growerId, 1)
  t.is(name, 'New Product')
  t.is(supply, 32)
  t.is(typeof id, 'number')
})

test('POST /growers/:id/products is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: '2.45',
    supply: 32,
    categoryId: 1
  })
  response.assert(401)
})

test('POST /growers/:id/products is a 200 if allowed', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.post('/growers/1/products').send({
    categoryId: 1,
    cost: '2.50',
    featured: true,
    name: 'New Product',
    supply: 23
  })
  response.assert(200)
  const {categoryId, cost, featured, name, supply} = response.body.product
  t.is(categoryId, 1)
  t.is(cost, '2.50')
  t.is(featured, false)
  t.is(name, 'New Product')
  t.is(supply, 23)
})

test('POST /growers/:id/products is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: '2.50',
    supply: 23,
    categoryId: 1,
    featured: true
  })
  response.assert(200)
  const {categoryId, cost, featured, name, supply} = response.body.product
  t.is(categoryId, 1)
  t.is(cost, '2.50')
  t.is(featured, true)
  t.is(name, 'New Product')
  t.is(supply, 23)
})

test('POST /growers/:id/products is a 422 for invalid data', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: 'asdf',
    supply: 23,
    categoryId: 1
  })
  response.assert(422)
})

// New Product

test('GET /growers/:id/products/new is a 401 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.assert(401)
})

test('GET /growers/:id/products/new is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.assert(200)
})

test('GET /growers/:id/products/new is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.assert(200)
})

test('GET /growers/:id/products/new is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.assert(200)
})

test('GET /growers/:id/products/new is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.assert(401)
})

// Products

test('GET /growers/:id/products is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/products').send()
  response.assert(200)
})

test('GET /growers/:id/products is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1/products').send()
  response.assert(200)
})

test('GET /growers/:id/products is a 401 for non-growers', function *(t) {
  yield t.signIn('info@planitfoods.com')
  const response = yield t.client.get('/growers/1/products').send()
  response.assert(401)
})
