var test = require('../test')

test('GET /growers is a 200', function (t) {
  t.request()
  .get('/growers')
  .expect(200)
  .end(t.end)
})

test('GET /growers/:id is a 200', function (t) {
  t.request()
  .get('/growers/1')
  .expect(200)
  .end(t.end)
})

test('GET /growers/:id is a 404 for missing ids', function (t) {
  t.request()
  .get('/growers/123456789')
  .expect(404)
  .end(t.end)
})

test('GET /growers/:id is a 404 for missing ids', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /growers/new is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/new is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/new is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 200 for allowed users', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/1/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 200 for allowed users', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/1/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 401 for non-admins', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/2/orders')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/1/orders')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/growers/1')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id is a 302 for admins', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers/1')
    .send('name=Watsonia')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})

test('POST /growers/:id is a 302 for allowed users', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/growers/1')
    .send('name=Watsonia')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})

test('POST /growers is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/growers')
    .send('name=New Grower')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers')
    .send('name=New Grower')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((e, res) => {
      if (e) return t.end(e)
      t.is(res.body.name, 'New Grower')
      t.is(typeof res.body.id, 'number')
      t.end()
    })
  })
})

test('POST /growers/:id/products is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send('name=New Grower')
    .send('cost=2.45')
    .send('supply=32')
    .send('category_id=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((e, res) => {
      if (e) return t.end(e)
      t.is(res.body.cost, '2.45')
      t.is(res.body.category_id, 1)
      t.is(res.body.supply, 32)
      t.is(res.body.name, 'New Grower')
      t.is(typeof res.body.id, 'number')
      t.end()
    })
  })
})

test('POST /growers/:id/products is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send('name=New Product')
    .send('cost=2.45')
    .send('supply=32')
    .send('category_id=1')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 200 if allowed', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send('name=New Product')
    .send('cost=2.50')
    .send('supply=23')
    .send('category_id=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send('name=New Product')
    .send('cost=2.50')
    .send('supply=23')
    .send('category_id=1')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 422 for invalid data', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/growers/1/products')
    .send('name=New Product')
    .send('cost=asdf')
    .send('supply=23')
    .send('category_id=1')
    .expect(422)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 for allowed users', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(() => {
    t.agent.get('/growers/1/products/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id authorized users see new product link', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent
    .get('/growers/1')
    .expect(200)
    .expect(function (res) {
      if (!~res.text.indexOf('/growers/1/products/new')) {
        return 'missing new product link'
      }
    })
    .end(t.end)
  })
})

test('GET /growers does not return inactive growers', function (t) {
  t.request()
  .get('/growers')
  .expect(200)
  .expect(function (res) {
    if (~res.text.indexOf('/growers/3')) {
      return 'should not see inactive growers'
    }
  })
  .end(t.end)
})

test('GET /growers/:id as admin includes inactive products', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/growers/2')
    .expect(200)
    .expect(function (res) {
      if (!~res.text.indexOf('/products/7')) {
        return 'should see inactive products'
      }
      if (!~res.text.indexOf('/products/4')) {
        return 'should see active products'
      }
    })
    .end(t.end)
  })
})

test('GET /growers/:id as grower includes inactive products', function (t) {
  t.signIn('info@planitfoods.com').then(() => {
    t.agent
    .get('/growers/2')
    .expect(200)
    .expect(function (res) {
      if (!~res.text.indexOf('/products/7')) {
        return 'should see inactive products'
      }
      if (!~res.text.indexOf('/products/4')) {
        return 'should see active products'
      }
    })
    .end(t.end)
  })
})

test('GET /growers/:id as non-grower does not include inactive products', function (t) {
  t.signIn('info@planitfoods.com').then(() => {
    t.agent
    .get('/growers/1')
    .expect(200)
    .expect(function (res) {
      if (~res.text.indexOf('/products/8')) {
        return 'should not see inactive products'
      }
      if (!~res.text.indexOf('/products/1')) {
        return 'should see active products'
      }
    })
    .end(t.end)
  })
})

test('GET /growers/:id/products', function (t) {
  t.signIn('grower@example.com').then(() => {
    t.agent.get('/growers/1/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products is a 401 for non-growers', function (t) {
  t.signIn('info@planitfoods.com').then(() => {
    t.agent.get('/growers/1/products')
    .expect(401)
    .end(t.end)
  })
})
