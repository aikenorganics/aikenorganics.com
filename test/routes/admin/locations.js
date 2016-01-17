'use strict'

const db = require('../../../db')
const test = require('../../test')

test('GET /admin/locations is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/locations')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/locations/new is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/locations/new')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/locations/:id/edit is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/locations/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('POST /admin/locations is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/locations')
    .send('name=Test')
    .expect(200)
    .end(t.end)
  })
})

test('POST /admin/locations/:id is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/locations/1')
    .send('name=Test')
    .expect(200)
    .end((e) => {
      if (e) return t.end(e)
      db.Location.find(1).then((location) => {
        t.is(location.name, 'Test')
        t.end()
      })
    })
  })
})

test('DELETE /admin/locations/:id is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent.delete('/admin/locations/2')
    .expect(200)
    .end((e) => {
      if (e) return t.end(e)
      db.Location.find(2).then((location) => {
        t.ok(!location)
        t.end()
      })
    })
  })
})
