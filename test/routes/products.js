var test = require('tape')
var request = require('./request')

// Index

test('GET /products is a 200 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 as a non-admin', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 as an authorized user', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 signed out', function (t) {
  request()
  .get('/products')
  .expect(200)
  .end(t.end)
})

test('GET /products?category_id=:id is a 200', function (t) {
  request()
  .get('/products?category_id=1')
  .expect(200)
  .end(t.end)
})

// Show

test('GET /products/:id is a 200 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 as a non-admin', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 as an authorized user', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    if (e) return t.end(e)
    agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 signed out', function (t) {
  request()
  .get('/products/1')
  .expect(200)
  .end(t.end)
})

// Edit

test('GET /products/edit is a 401 signed out', function (t) {
  request().get('/products/1/edit')
  .expect(401)
  .end(t.end)
})

test('GET /products/edit is a 401 as a non-admin', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.get('/products/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /products/edit is a 200 as an authorized user', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    agent.get('/products/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/edit is a 200 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.get('/products/1/edit')
    .expect(200)
    .end(t.end)
  })
})

// Update

test('POST /products/:id is a 302 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.post('/products/1')
    .field('name', 'Peaches')
    .expect(302)
    .end(t.end)
  })
})

test('POST /products/:id is a 302 as an authorized user', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    agent.post('/products/1')
    .field('name', 'Peaches')
    .expect(302)
    .end(t.end)
  })
})

test('POST /products/:id is a 401 as a non-admin', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.post('/products/1')
    .field('name', 'Peaches')
    .expect(401)
    .end(t.end)
  })
})

// Image

test('POST /products/:id/image is a 401 as a non-admin', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.post('/products/1')
    .expect(401)
    .end(t.end)
  })
})
