'use strict'

const db = require('../../db')
const test = require('../test')

// Index

test('GET /products is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 as a non-admin', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 as an authorized user', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 signed out', (t) => {
  t.request()
  .get('/products')
  .expect(200)
  .end(t.end)
})

test('GET /products?category_id=:id is a 200', (t) => {
  t.request()
  .get('/products?category_id=1')
  .expect(200)
  .end(t.end)
})

test('GET /products?search=query is a 200 logged in', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/products?search=peach')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products?search=query is a 200 logged out', (t) => {
  t.request()
  .get('/products?search=peach')
  .expect(200)
  .end(t.end)
})

test('GET /products?search=foo%20bar is a 200', (t) => {
  t.request()
  .get('/products?search=ice%20cream')
  .expect(200)
  .end(t.end)
})

// Show

test('GET /products/:id is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 as a non-admin', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 as an authorized user', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 signed out', (t) => {
  t.request()
  .get('/products/1')
  .expect(200)
  .end(t.end)
})

// Edit

test('GET /products/edit is a 401 signed out', (t) => {
  t.request().get('/products/1/edit')
  .expect(401)
  .end(t.end)
})

test('GET /products/edit is a 401 as a non-admin', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/products/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /products/edit is a 200 as an authorized user', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/products/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/edit is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/products/1/edit')
    .expect(200)
    .end(t.end)
  })
})

// Update

test('POST /products/:id is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/products/1')
    .send('name=Peaches')
    .expect(200)
    .end(t.end)
  })
})

test('POST /products/:id is a 200 as an authorized user', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/products/1')
    .send('name=Peaches')
    .expect(200)
    .end(t.end)
  })
})

test('POST /products/:id is a 401 as a non-admin', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/products/1')
    .send('name=Peaches')
    .expect(401)
    .end(t.end)
  })
})

test('POST /products/:id is a 422 for invalid data', (t) => {
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

test('POST /products/:id accepts JSON', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/products/1')
    .set('Accept', 'application/json')
    .send({supply: 20})
    .expect('Content-Type', /application\/json/)
    .expect(200)
    .end(t.end)
  })
})

test('admins can update featured', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/products/1')
    .send({featured: true})
    .expect(200)
    .end((error, response) => {
      if (error) return t.end(error)
      db.Product.find(1).then((product) => {
        t.is(product.featured, true)
        t.end()
      }).catch(t.end)
    })
  })
})

test('non-admins cannot update featured', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/products/1')
    .send({featured: true})
    .expect(200)
    .end((error, response) => {
      if (error) return t.end(error)
      db.Product.find(1).then((product) => {
        t.is(product.featured, false)
        t.end()
      }).catch(t.end)
    })
  })
})

// Image

test('POST /products/:id/image is a 401 as a non-admin', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/products/1')
    .expect(401)
    .end(t.end)
  })
})

test('GET /products has no inactive products', (t) => {
  t.request()
  .get('/products')
  .expect(200)
  .expect((res) => {
    if (~res.text.indexOf('/products/6')) {
      return 'should not see inactive growers'
    }
    if (~res.text.indexOf('/products/7')) {
      return 'should not see inactive products'
    }
  })
  .end(t.end)
})

test('POST /products/:id activates products', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/products/1')
    .send('active=0')
    .expect(302)
    .end((e) => {
      if (e) return t.end()
      db.Product.find(1).then((product) => {
        t.equal(product.active, false)
        t.end()
      })
    })
  })
})

test('POST /products/:id deactivates products', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/products/7')
    .send('active=1')
    .expect(302)
    .end((e) => {
      if (e) return t.end()
      db.Product.find(7).then((product) => {
        t.equal(product.active, true)
        t.end()
      })
    })
  })
})
