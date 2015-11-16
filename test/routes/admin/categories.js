'use strict'

let db = require('../../../db')
let test = require('../../test')

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
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/categories/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('POST /admin/categories is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/admin/categories')
    .send('name=Test')
    .send('position=2')
    .expect(302)
    .end(t.end)
  })
})

test('POST /admin/categories/:id is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/admin/categories/1')
    .send('name=test')
    .send('position=106')
    .expect(302)
    .end(t.end)
  })
})

test('POST /admin/categories/:id/delete is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/admin/categories/6/delete')
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.transaction(function () {
        db.Category.find(6).then(function (category) {
          t.is(category, null)
          t.end()
        })
      }).catch(t.end)
    })
  })
})
