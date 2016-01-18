'use strict'

let db = require('../../db')
let test = require('../test')

// Index

test('GET /products is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 as a non-admin', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 as an authorized user', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 signed out', function (t) {
  t.request()
  .get('/products')
  .expect(200)
  .end(t.end)
})

test('GET /products?category_id=:id is a 200', function (t) {
  t.request()
  .get('/products?category_id=1')
  .expect(200)
  .end(t.end)
})

test('GET /products?search=query is a 200 logged in', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/products?search=peach')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products?search=query is a 200 logged out', function (t) {
  t.request()
  .get('/products?search=peach')
  .expect(200)
  .end(t.end)
})

// Show

test('GET /products/:id is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 as a non-admin', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 as an authorized user', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 signed out', function (t) {
  t.request()
  .get('/products/1')
  .expect(200)
  .end(t.end)
})

// Edit

test('GET /products/edit is a 401 signed out', function (t) {
  t.request().get('/products/1/edit')
  .expect(401)
  .end(t.end)
})

test('GET /products/edit is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/products/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /products/edit is a 200 as an authorized user', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/products/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/edit is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/products/1/edit')
    .expect(200)
    .end(t.end)
  })
})

// Update

test('POST /products/:id is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/products/1')
    .send('name=Peaches')
    .expect(200)
    .end(t.end)
  })
})

test('POST /products/:id is a 200 as an authorized user', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/products/1')
    .send('name=Peaches')
    .expect(200)
    .end(t.end)
  })
})

test('POST /products/:id is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/products/1')
    .send('name=Peaches')
    .expect(401)
    .end(t.end)
  })
})

test('POST /products/:id is a 422 for invalid data', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/products/1')
    .send('name=')
    .send('cost=asdf')
    .send('supply=-23')
    .send('category_id=1')
    .expect(422)
    .end(t.end)
  })
})

test('POST /products/:id accepts JSON', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/products/1')
    .set('Accept', 'application/json')
    .send({supply: 20})
    .expect('Content-Type', /application\/json/)
    .expect(200)
    .end(t.end)
  })
})

// Image

test('POST /products/:id/image is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/products/1')
    .expect(401)
    .end(t.end)
  })
})

test('GET /products has no inactive products', function (t) {
  t.request()
  .get('/products')
  .expect(200)
  .expect(function (res) {
    if (~res.text.indexOf('/products/6')) {
      return 'should not see inactive growers'
    }
    if (~res.text.indexOf('/products/7')) {
      return 'should not see inactive products'
    }
  })
  .end(t.end)
})

test('POST /products/:id activates products', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/products/1')
    .send('active=0')
    .expect(302)
    .end(function (e) {
      if (e) return t.end()
      db.Product.find(1).then(function (product) {
        t.equal(product.active, false)
        t.end()
      })
    })
  })
})

test('POST /products/:id deactivates products', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/products/7')
    .send('active=1')
    .expect(302)
    .end(function (e) {
      if (e) return t.end()
      db.Product.find(7).then(function (product) {
        t.equal(product.active, true)
        t.end()
      })
    })
  })
})
