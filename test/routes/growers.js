'use strict'

const test = require('../test')

test('GET /growers is a 200', function *(t) {
  const response = yield t.client.get('/growers').send()
  response.expect(200)
})

test('GET /growers is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers').send()
  response.expect(200)
})

test('GET /growers is a 200 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers').send()
  response.expect(200)
})

test('GET /growers/:id is a 200', function *(t) {
  const response = yield t.client.get('/growers/1').send()
  response.expect(200)
})

test('GET /growers/:id is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1').send()
  response.expect(200)
})

test('GET /growers/:id is a 200 as a grower', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1').send()
  response.expect(200)
})

test('GET /growers/:id is a 404 for missing ids', function *(t) {
  const response = yield t.client.get('/growers/123456789').send()
  response.expect(404)
})

test('GET /growers/:id is a 404 for missing ids', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/123456789').send()
  response.expect(404)
})

test('GET /growers/new is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/new').send()
  response.expect(200)
})

test('GET /growers/new is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/new').send()
  response.expect(200)
})

test('GET /growers/new is a 401 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/new').send()
  response.expect(401)
})

test('GET /growers/:id/products/new is a 401 as a non-admin', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.expect(401)
})

test('GET /growers/:id/products/new is a 200 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.expect(200)
})

test('GET /growers/:id/edit is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/1/edit').send()
  response.expect(401)
})

test('GET /growers/:id/edit is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/edit').send()
  response.expect(200)
})

test('GET /growers/:id/edit is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1/edit').send()
  response.expect(200)
})

test('GET /growers/:id/orders is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/orders').send()
  response.expect(200)
})

test('GET /growers/:id/orders is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1/orders').send()
  response.expect(200)
})

test('GET /growers/:id/orders is a 401 for non-admins', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/2/orders').send()
  response.expect(401)
})

test('GET /growers/:id/orders is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/1/orders').send()
  response.expect(401)
})

test('POST /growers/:id is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/growers/1').send()
  response.expect(401)
})

test('POST /growers/:id is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/growers/1').send({name: 'Watsonia'})
  response.expect(200).expect('content-type', /json/)
})

test('POST /growers/:id is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.post('/growers/1').send({name: 'Watsonia'})
  response.expect(200).expect('content-type', /json/)
})

test('POST /growers is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.post('/growers').send({name: 'New Grower'})
  response.expect(401)
})

test('POST /growers is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/growers').send({name: 'New Grower'})
  response.expect(200).expect('content-type', /json/)
  const {id, name} = response.body.grower
  t.is(name, 'New Grower')
  t.is(typeof id, 'number')
})

test('POST /growers/:id/products is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/growers/1/products').send({
    name: 'New Product',
    cost: '2.45',
    supply: 32,
    categoryId: 1
  })
  response.expect(200).expect('Content-Type', /json/)
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
  response.expect(401)
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
  response.expect(200)
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
  response.expect(200)
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
  response.expect(422)
})

test('GET /growers/:id/products/new is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.expect(200)
})

test('GET /growers/:id/products/new is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.expect(200)
})

test('GET /growers/:id/products/new is a 401 for non-admins', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/growers/1/products/new').send()
  response.expect(401)
})

test('GET /growers/:id authorized users see new product link', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1').send()
  response.expect(200).expect(/\/growers\/1\/products\/new/)
})

test('GET /growers does not return inactive growers', function *(t) {
  const response = yield t.client
    .get('/growers')
    .set('accept', 'application/json')
    .send()
  response.expect(200)
  t.ok(response.body.growers.every(({id}) => id !== 3))
})

test('GET /growers/:id as admin includes inactive products', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .get('/growers/2')
    .set('accept', 'application/json')
    .send()
  response.expect(200)
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
  response.expect(200)
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
  response.expect(200)
  const {products} = response.body
  t.ok(products.every(({id}) => id !== 8), 'should not see inactive products')
  t.ok(products.some(({id}) => id === 1), 'should see active products')
})

test('GET /growers/:id/products is a 200 for admins', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/growers/1/products').send()
  response.expect(200)
})

test('GET /growers/:id/products is a 200 for allowed users', function *(t) {
  yield t.signIn('grower@example.com')
  const response = yield t.client.get('/growers/1/products').send()
  response.expect(200)
})

test('GET /growers/:id/products is a 401 for non-growers', function *(t) {
  yield t.signIn('info@planitfoods.com')
  const response = yield t.client.get('/growers/1/products').send()
  response.expect(401)
})
