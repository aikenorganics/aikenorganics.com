'use strict'

const {Location} = require('../../../db')
const test = require('../../test')

// Index

test('GET /admin/locations is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent
  .get('/admin/locations')
  .expect(200)
  .end(t.end)
})

// New

test('GET /admin/locations/new is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent
  .get('/admin/locations/new')
  .expect(200)
  .end(t.end)
})

// Edit

test('GET /admin/locations/missing/edit is a 404', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.get('/admin/locations/12345/edit').expect(404).end(t.end)
})

test('GET /admin/locations/:id/edit is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent
  .get('/admin/locations/1/edit')
  .expect(200)
  .end(t.end)
})

// Create

test('POST /admin/locations is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent
  .post('/admin/locations')
  .send('name=Test')
  .expect(200)
  .end(t.end)
})

// Update

test('POST /admin/locations/missing is a 404', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.post('/admin/locations/12345').expect(404).end(t.end)
})

test('POST /admin/locations/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent
  .post('/admin/locations/1')
  .send('name=Test')
  .expect(200)
  .end((error) => {
    if (error) return t.end(error)
    Location.find(1).then((location) => {
      t.is(location.name, 'Test')
      t.end()
    })
  })
})

// Destroy

test('DELETE /admin/locations/missing is a 404', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.delete('/admin/locations/12345').expect(404).end(t.end)
})

test('DELETE /admin/locations/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent.delete('/admin/locations/2')
  .expect(200)
  .end((error) => {
    if (error) return t.end(error)
    Location.find(2).then((location) => {
      t.ok(!location)
      t.end()
    })
  })
})
