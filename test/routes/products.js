'use strict'

const Event = require('../../db/event')
const Product = require('../../db/product')
const test = require('../test')

// Index

test('GET /products is a 200 as an admin', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/products').send()
  response.assert(200)
})

test('GET /products is a 200 as a non-admin', async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.get('/products').send()
  response.assert(200)
})

test('GET /products is a 200 as an authorized user', async ({assert, client}) => {
  await client.signIn('grower@example.com')
  const response = await client.get('/products').send()
  response.assert(200)
})

test('GET /products is a 200 signed out', async ({assert, client}) => {
  const response = await client.get('/products').send()
  response.assert(200)
})

test('GET /products?categoryId=:id is a 200', async ({assert, client}) => {
  const response = await client.get('/products?categoryId=1').send()
  response.assert(200)
})

test('GET /products?search=query is a 200 logged in', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/products?search=peach').send()
  response.assert(200)
})

test('GET /products?search=query is a 200 logged out', async ({assert, client}) => {
  const response = await client.get('/products?search=peach').send()
  response.assert(200)
})

test('GET /products?search=foo%20bar is a 200', async ({assert, client}) => {
  const response = await client.get('/products?search=ice%20cream').send()
  response.assert(200)
})

test('GET /products?categoryId=junk is a 200', async ({assert, client}) => {
  const response = await client.get('/products?categoryId=junk').send()
  response.assert(200)
})

test('GET /products?growerId=junk is a 200', async ({assert, client}) => {
  const response = await client.get('/products?growerId=junk').send()
  response.assert(200)
})

test('GET /products?page=junk is a 200', async ({assert, client}) => {
  const response = await client.get('/products?page=junk').send()
  response.assert(200)
})

test('GET /products?certified=1 is a 200', async ({assert, client}) => {
  const response = await client.get('/products?certified=1').send()
  response.assert(200)
})

test('GET /products?certified=1 returns the correct products', async ({assert, client}) => {
  const response = await client
    .get('/products?certified=1')
    .set('accept', 'application/json')
    .send()
  response.assert(200)
  response.assert('content-type', /json/)
  assert.deepEqual(response.body.products.map(({id}) => id), [2])
})

// Show

test('GET /products/:id is a 200 as an admin', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/products/1').send()
  response.assert(200)
})

test('GET /products/:id is a 200 as a non-admin', async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.get('/products/1').send()
  response.assert(200)
})

test('GET /products/:id is a 200 as an authorized user', async ({assert, client}) => {
  await client.signIn('grower@example.com')
  const response = await client.get('/products/1').send()
  response.assert(200)
})

test('GET /products/:id is a 200 signed out', async ({assert, client}) => {
  const response = await client.get('/products/1').send()
  response.assert(200)
})

// Edit

test('GET /products/edit is a 401 signed out', async ({assert, client}) => {
  const response = await client.get('/products/1/edit').send()
  response.assert(401)
})

test('GET /products/edit is a 401 as a non-admin', async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.get('/products/1/edit').send()
  response.assert(401)
})

test('GET /products/edit is a 200 as an authorized user', async ({assert, client}) => {
  await client.signIn('grower@example.com')
  const response = await client.get('/products/1/edit').send()
  response.assert(200)
})

test('GET /products/edit is a 200 as an admin', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.get('/products/1/edit').send()
  response.assert(200)
})

// Update

test('POST /products/:id is a 200 as an admin', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.post('/products/1').send('name=Peaches')
  response.assert(200)
})

test('POST /products/:id is a 200 as an authorized user', async ({assert, client}) => {
  await client.signIn('grower@example.com')
  const response = await client.post('/products/1').send('name=Peaches')
  response.assert(200)
})

test('POST /products/:id is a 401 as a non-admin', async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.post('/products/1').send('name=Peaches')
  response.assert(401)
})

test('POST /products/:id is a 422 for invalid data', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.post('/products/1').send({
    name: '',
    cost: 'asdf',
    supply: -23,
    categoryId: 1
  })
  response.assert(422)
})

test('POST /products/:id accepts JSON', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client
    .post('/products/1')
    .set('accept', 'application/json')
    .send({supply: 20})
  response.assert(200).assert('content-type', /application\/json/)
})

test('admins can update featured', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.post('/products/1').send({featured: true})
  response.assert(200)
  const product = await Product.find(1)
  assert.is(product.featured, true)
})

test('non-admins cannot update featured', async ({assert, client}) => {
  await client.signIn('grower@example.com')
  const response = await client.post('/products/1').send({featured: true})
  response.assert(200)
  const product = await Product.find(1)
  assert.is(product.featured, false)
})

test('updating creates an event', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.post('/products/1').send({featured: true})
  response.assert(200)
  const event = await Event.where({productId: 1}).find()
  assert.deepEqual(event.meta, {featured: true})
  assert.is(event.userId, 1)
  assert.is(event.action, 'update')
  assert.is(event.growerId, null)
  assert.is(event.productId, 1)
})

// Image

test('POST /products/:id/image is a 401 as a non-admin', async ({assert, client}) => {
  await client.signIn('user@example.com')
  const response = await client.post('/products/1').send()
  response.assert(401)
})

test('GET /products has no inactive products', async ({assert, client}) => {
  const response = await client.get('/products').send()
  response.assert(200)
  assert.ok(!/\/products\/6/.test(response.body), 'should not see inactive growers')
  assert.ok(!/\/products\/7/.test(response.body), 'should not see inactive growers')
})

test('POST /products/:id deactivates products', async ({assert, client}) => {
  await client.signIn('grower@example.com')
  const response = await client.post('/products/1').send({active: false})
  response.assert(200)
  const product = await Product.find(1)
  assert.equal(product.active, false)
})

test('POST /products/:id activates products', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  const response = await client.post('/products/7').send({active: true})
  response.assert(200)
  const product = await Product.find(7)
  assert.equal(product.active, true)
})

test('POST /products/:id changes certified', async ({assert, client}) => {
  await client.signIn('admin@example.com')
  assert.equal((await Product.find(1)).certified, false)
  const response = await client.post('/products/1').send({certified: true})
  response.assert(200)
  assert.equal((await Product.find(1)).certified, true)
})
