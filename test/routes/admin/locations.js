var test = require('../../test')
var db = require('../../../db')

test('GET /admin/locations is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/admin/locations')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/locations/new is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/admin/locations/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/locations/:id/edit is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/admin/locations/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('POST /admin/locations is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/locations')
    .field('name', 'Test')
    .expect(302)
    .end(t.end)
  })
})

test('POST /admin/locations/:id is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/locations/1')
    .field('name', 'Test')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      t.tx.run(function () {
        db.Location.find(1).then(function (location) {
          t.is(location.name, 'Test')
          t.end()
        })
      })
    })
  })
})
