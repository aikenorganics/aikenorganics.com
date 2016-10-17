'use strict'

const {Location} = require('../../../db')
const test = require('../../test')

// Index

test('GET /admin/locations is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/locations').send()
  response.expect(200)
})

// New

test('GET /admin/locations/new is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/locations/new').send()
  response.expect(200)
})

// Edit

test('GET /admin/locations/missing/edit is a 404', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/locations/12345/edit').send()
  response.expect(404)
})

test('GET /admin/locations/:id/edit is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/locations/1/edit').send()
  response.expect(200)
})

// Create

test('POST /admin/locations is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/admin/locations').send({name: 'Test'})
  response.expect(200)
  const location = yield Location.find(response.body.location.id)
  t.is(location.name, 'Test')
})

// Update

test('POST /admin/locations/missing is a 404', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.post('/admin/locations/12345').send()
  response.expect(404)
})

test('POST /admin/locations/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')

  const response = yield t.client
    .post('/admin/locations/1')
    .send({name: 'Test'})
  response.expect(200)

  const location = yield Location.find(1)
  t.is(location.name, 'Test')
})

// Destroy

test('DELETE /admin/locations/missing is a 404', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.delete('/admin/locations/12345').send()
  response.expect(404)
})

test('DELETE /admin/locations/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.delete('/admin/locations/2').send()
  response.expect(200)
  const location = yield Location.find(2)
  t.ok(!location)
})
