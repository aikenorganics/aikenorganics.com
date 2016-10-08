const test = require('../test')

test('GET /growers is a 200', (t) => {
  t.request()
  .get('/growers')
  .expect(200)
  .end(t.end)
})

test('GET /growers/:id is a 200', (t) => {
  t.request()
  .get('/growers/1')
  .expect(200)
  .end(t.end)
})

test('GET /growers/:id is a 404 for missing ids', (t) => {
  t.request()
  .get('/growers/123456789')
  .expect(404)
  .end(t.end)
})

test('GET /growers/:id is a 404 for missing ids', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /growers/new is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 401 as a non-admin', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/new is a 401 as a non-admin', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/new is a 200 as an admin', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 401 for non-admins', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 200 for admins', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 200 for allowed users', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 200 for admins', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/1/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 200 for allowed users', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/1/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 401 for non-admins', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/2/orders')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 401 for non-admins', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/1/orders')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id is a 401 for non-admins', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/growers/1')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id is a 302 for admins', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers/1')
    .send('name=Watsonia')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})

test('POST /growers/:id is a 302 for allowed users', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/growers/1')
    .send('name=Watsonia')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})

test('POST /growers is a 401 for non-admins', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/growers')
    .send('name=New Grower')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers is a 200 for admins', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers')
    .send('name=New Grower')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error, response) => {
      if (error) return t.end(error)
      const {id, name} = response.body.grower
      t.is(name, 'New Grower')
      t.is(typeof id, 'number')
      t.end()
    })
  })
})

test('POST /growers/:id/products is a 200 for admins', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send('name=New Product')
    .send('cost=2.45')
    .send('supply=32')
    .send('categoryId=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((error, response) => {
      if (error) return t.end(error)
      const {categoryId, cost, id, name, supply} = response.body.product
      t.is(categoryId, 1)
      t.is(cost, '2.45')
      t.is(name, 'New Product')
      t.is(supply, 32)
      t.is(typeof id, 'number')
      t.end()
    })
  })
})

test('POST /growers/:id/products is a 401 for non-admins', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send('name=New Product')
    .send('cost=2.45')
    .send('supply=32')
    .send('categoryId=1')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 200 if allowed', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send({
      categoryId: 1,
      cost: '2.50',
      featured: true,
      name: 'New Product',
      supply: 23
    })
    .expect(200)
    .end((error, response) => {
      if (error) return t.end(error)
      const {categoryId, cost, featured, name, supply} = response.body.product
      t.is(categoryId, 1)
      t.is(cost, '2.50')
      t.is(featured, false)
      t.is(name, 'New Product')
      t.is(supply, 23)
      t.end()
    })
  })
})

test('POST /growers/:id/products is a 200 for admins', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send({
      name: 'New Product',
      cost: '2.50',
      supply: 23,
      categoryId: 1,
      featured: true
    })
    .expect(200)
    .end((error, response) => {
      if (error) return t.end(error)
      const {categoryId, cost, featured, name, supply} = response.body.product
      t.is(categoryId, 1)
      t.is(cost, '2.50')
      t.is(featured, true)
      t.is(name, 'New Product')
      t.is(supply, 23)
      t.end()
    })
  })
})

test('POST /growers/:id/products is a 422 for invalid data', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send('name=New Product')
    .send('cost=asdf')
    .send('supply=23')
    .send('categoryId=1')
    .expect(422)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 for admins', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 for allowed users', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 401 for non-admins', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id authorized users see new product link', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent
    .get('/growers/1')
    .expect(200)
    .expect((response) => {
      if (!~response.text.indexOf('/growers/1/products/new')) {
        return 'missing new product link'
      }
    })
    .end(t.end)
  })
})

test('GET /growers does not return inactive growers', (t) => {
  t.request()
  .get('/growers')
  .expect(200)
  .expect((response) => {
    if (~response.text.indexOf('/growers/3')) {
      return 'should not see inactive growers'
    }
  })
  .end(t.end)
})

test('GET /growers/:id as admin includes inactive products', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/growers/2')
    .expect(200)
    .expect((response) => {
      if (!~response.text.indexOf('/products/7')) {
        return 'should see inactive products'
      }
      if (!~response.text.indexOf('/products/4')) {
        return 'should see active products'
      }
    })
    .end(t.end)
  })
})

test('GET /growers/:id as grower includes inactive products', (t) => {
  t.signIn('info@planitfoods.com').then(() => {
    t.agent
    .get('/growers/2')
    .expect(200)
    .expect((response) => {
      if (!~response.text.indexOf('/products/7')) {
        return 'should see inactive products'
      }
      if (!~response.text.indexOf('/products/4')) {
        return 'should see active products'
      }
    })
    .end(t.end)
  })
})

test('GET /growers/:id as non-grower does not include inactive products', (t) => {
  t.signIn('info@planitfoods.com').then(() => {
    t.agent
    .get('/growers/1')
    .expect(200)
    .expect((response) => {
      if (~response.text.indexOf('/products/8')) {
        return 'should not see inactive products'
      }
      if (!~response.text.indexOf('/products/1')) {
        return 'should see active products'
      }
    })
    .end(t.end)
  })
})

test('GET /growers/:id/products', (t) => {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/1/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products is a 401 for non-growers', (t) => {
  t.signIn('info@planitfoods.com').then(() => {
    t.agent.get('/growers/1/products')
    .expect(401)
    .end(t.end)
  })
})
