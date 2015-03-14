var test = require('tape')
var request = require('./request')
var models = require('../../models')

test('GET /growers is a 200', function (t) {
  request()
  .get('/growers')
  .expect(200)
  .end(t.end)
})

test('GET /growers/:id is a 200', function (t) {
  models.Grower.findOne({}).then(function (grower) {
    request()
    .get('/growers/' + grower.id)
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id is a 404 for missing ids', function (t) {
  request()
  .get('/growers/123456789')
  .expect(404)
  .end(t.end)
})

test('GET /growers/show is a 404 for missing ids', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.get('/growers/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /growers/new is a 200', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.get('/growers/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 401 as a non-admin', function (t) {
  models.Grower.findAll().then(function (growers) {
    var agent = request().signIn('user@example.com', function (e) {
      agent.get('/growers/' + growers[0].id + '/products/new')
      .expect(401)
      .end(t.end)
    })
  })
})

test('GET /growers/:id/products/new is a 200 as an admin', function (t) {
  models.Grower.findAll().then(function (growers) {
    var agent = request().signIn('admin@example.com', function (e) {
      if (e) return t.end(e)
      agent.get('/growers/' + growers[0].id + '/products/new')
      .expect(200)
      .end(t.end)
    })
  })
})

test('GET /growers/new is a 401 as a non-admin', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.get('/growers/new')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/new is a 200 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.get('/growers/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 401 for non-admins', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.get('/growers/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 200 for admins', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.get('/growers/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/edit is a 200 for allowed users', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    agent.get('/growers/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 200 for admins', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.get('/growers/1/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 200 for allowed users', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    agent.get('/growers/1/orders')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 401 for non-admins', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    agent.get('/growers/2/orders')
    .expect(401)
    .end(t.end)
  })
})

test('GET /growers/:id/orders is a 401 for non-admins', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.get('/growers/1/orders')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id is a 401 for non-admins', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.post('/growers/1')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers/:id is a 302 for admins', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.post('/growers/1')
    .field('name', 'Watsonia')
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers/:id is a 302 for allowed users', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    agent.post('/growers/1')
    .field('name', 'Watsonia')
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers is a 401 for non-admins', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.post('/growers')
    .field('name', 'New Grower')
    .expect(401)
    .end(t.end)
  })
})

test('POST /growers is a 302 for admins', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.post('/growers')
    .field('name', 'New Grower')
    .expect(302)
    .end(t.end)
  })
})

test('POST /growers/:id/products is a 302 for admins', function (t) {
  models.Grower.findAll({limit: 1}).then(function (growers) {
    models.Category.findAll({limit: 1}).then(function (categories) {
      var agent = request().signIn('admin@example.com', function (e) {
        agent.post('/growers/' + growers[0].id + '/products')
        .field('name', 'New Grower')
        .field('cost', '2.45')
        .field('supply', 32)
        .field('category_id', categories[0].id)
        .expect(302)
        .end(t.end)
      })
    })
  })
})

test('POST /growers/:id/products is a 401 for non-admins', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    if (e) return t.end(e)
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
  var agent = request().signIn('grower@example.com', function (e) {
    if (e) return t.end(e)

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
  var agent = request().signIn('admin@example.com', function (e) {
    if (e) return t.end(e)

    agent.post('/growers/1/products')
    .field('name', 'New Product')
    .field('cost', '2.50')
    .field('supply', 23)
    .field('category_id', 1)
    .expect(302)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 for admins', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 200 for allowed users', function (t) {
  var agent = request().signIn('grower@example.com', function (e) {
    agent.get('/growers/1/products/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /growers/:id/products/new is a 401 for non-admins', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    agent.get('/growers/1/products/new')
    .expect(401)
    .end(t.end)
  })
})
