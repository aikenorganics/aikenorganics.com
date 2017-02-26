'use strict'

const {Location} = require('../../../db')
const test = require('../../test')

// Index

test('GET /admin/locations is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/locations').send()
  response.assert(200)
})

// New

test('GET /admin/locations/new is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/locations/new').send()
  response.assert(200)
})

// Edit

test('GET /admin/locations/missing/edit is a 404', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/locations/12345/edit').send()
  response.assert(404)
})

test('GET /admin/locations/:id/edit is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/locations/1/edit').send()
  response.assert(200)
})

// Create

test('POST /admin/locations is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.post('/admin/locations').send({name: 'Test'})
  response.assert(200)
  const location = await Location.find(response.body.location.id)
  t.is(location.name, 'Test')
})

// Update

test('POST /admin/locations/missing is a 404', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.post('/admin/locations/12345').send()
  response.assert(404)
})

test('POST /admin/locations/:id is a 200', async (t) => {
  await t.signIn('admin@example.com')

  const response = await t.client
    .post('/admin/locations/1')
    .send({name: 'Test'})
  response.assert(200)

  const location = await Location.find(1)
  t.is(location.name, 'Test')
})

// Destroy

test('DELETE /admin/locations/missing is a 404', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.delete('/admin/locations/12345').send()
  response.assert(404)
})

test('DELETE /admin/locations/:id is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.delete('/admin/locations/2').send()
  response.assert(200)
  const location = await Location.find(2)
  t.ok(!location)
})
