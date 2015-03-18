var test = require('../../test')
var models = require('../../../models')

test('GET /admin/categories/show is a 404 for missing ids', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/categories/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /admin/categories/new is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/categories/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/categories/:id/edit is a 200', function (t) {
  models.Category.findAll({limit: 1}).then(function (categories) {
    t.signIn('admin@example.com').then(function (agent) {
      agent.get('/admin/categories/' + categories[0].id + '/edit')
      .expect(200)
      .end(t.end)
    })
  })
})

test('POST /admin/categories is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/admin/categories')
    .field('name', 'Test')
    .field('position', '2')
    .expect(302)
    .end(t.end)
  })
})

test('POST /admin/categories/:id is a 302', function (t) {
  models.Category.findAll({limit: 1}).then(function (categories) {
    t.signIn('admin@example.com').then(function (agent) {
      agent.post('/admin/categories/' + categories[0].id)
      .field('name', categories[0].name)
      .field('position', categories[0].position)
      .expect(302)
      .end(t.end)
    })
  })
})
