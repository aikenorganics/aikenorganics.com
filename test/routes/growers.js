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
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/growers/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /growers/new is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/growers/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/growers/1/products/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/new is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/growers/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/new is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/growers/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/growers/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/growers/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 200 for allowed users', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.get('/growers/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/growers/1/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 200 for allowed users', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.get('/growers/1/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 401 for non-admins', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.get('/growers/2/orders')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/growers/1/orders')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.post('/growers/1')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id is a 302 for admins', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/growers/1')
    .field('name', 'Watsonia')
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers/:id is a 302 for allowed users', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.post('/growers/1')
    .field('name', 'Watsonia')
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.post('/growers')
    .field('name', 'New Grower')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers is a 302 for admins', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/growers')
    .field('name', 'New Grower')
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 302 for admins', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/growers/1/products')
    .field('name', 'New Grower')
    .field('cost', '2.45')
    .field('supply', 32)
    .field('category_id', 1)
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.post('/growers/1/products')
    .field('name', 'New Product')
    .field('cost', '2.45')
    .field('supply', 32)
    .field('category_id', 1)
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 302 if allowed', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.post('/growers/1/products')
    .field('name', 'New Product')
    .field('cost', '2.50')
    .field('supply', 23)
    .field('category_id', 1)
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 302 for admins', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/growers/1/products')
    .field('name', 'New Product')
    .field('cost', '2.50')
    .field('supply', 23)
    .field('category_id', 1)
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 422 for invalid data', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/growers/1/products')
    .field('name', 'New Product')
    .field('cost', 'asdf')
    .field('supply', 23)
    .field('category_id', 1)
    .expect(422)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 for admins', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 for allowed users', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 401 for non-admins', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/growers/1/products/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id authorized users see new product link', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent
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
