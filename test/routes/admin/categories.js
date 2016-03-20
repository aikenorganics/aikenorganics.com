'use strict'

let db = require('../../../db')
let test = require('../../test')

test('GET /admin/categories/show is a 404 for missing ids', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/categories/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /admin/categories/new is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/categories/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/categories/:id/edit is a 200', function (t) {
  t.signIn('admin@example.com').then((agent) => {
    t.agent.get('/admin/categories/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('POST /admin/categories is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/admin/categories')
    .send({name: 'Test', position: 2})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})

test('POST /admin/categories/:id is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/admin/categories/1')
    .send({name: 'test', position: 106})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(t.end)
  })
})

test('DELETE /admin/categories/:id is a 200', function (t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.delete('/admin/categories/6')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (e) {
      if (e) return t.end(e)
      db.Category.find(6).then(function (category) {
        t.is(category, null)
        t.end()
      }).catch(t.end)
    })
  })
})
