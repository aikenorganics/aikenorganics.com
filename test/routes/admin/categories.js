'use strict'

const db = require('../../../db')
const test = require('../../test')

test('GET /admin/categories/show is a 404 for missing ids', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/categories/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('GET /admin/categories/new is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.get('/admin/categories/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/categories/:id/edit is a 200', (t) => {
  t.signIn('admin@example.com').then((agent) => {
    t.agent.get('/admin/categories/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('POST /admin/categories is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/admin/categories')
    .send({name: 'test', position: 2, meat: true})
    .expect('Content-Type', /json/)
    .expect(200)
    .end((error, res) => {
      if (error) return t.end(error)
      const {category} = res.body
      t.is(category.name, 'test')
      t.is(category.position, 2)
      t.is(category.meat, true)
      t.end()
    })
  })
})

test('POST /admin/categories/:id is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.post('/admin/categories/1')
    .send({name: 'test', position: 106, meat: true})
    .expect('Content-Type', /json/)
    .expect(200)
    .end((error, res) => {
      if (error) return t.end(error)
      const {meat, name, position} = res.body.category
      t.is(name, 'test')
      t.is(position, 106)
      t.is(meat, true)
      t.end()
    })
  })
})

test('DELETE /admin/categories/:id is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.delete('/admin/categories/6')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error) => {
      if (error) return t.end(error)
      db.Category.find(6).then((category) => {
        t.is(category, null)
        t.end()
      }).catch(t.end)
    })
  })
})
