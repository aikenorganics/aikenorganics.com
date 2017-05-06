'use strict'

const {Category} = require('../../../db')
const test = require('../../test')

test('GET /admin/categories/show is a 404 for missing ids', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/categories/123456789').send()
  response.assert(404)
})

test('GET /admin/categories/new is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/categories/new').send()
  response.assert(200)
})

test('GET /admin/categories/:id/edit is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/categories/1/edit').send()
  response.assert(200)
})

test('POST /admin/categories is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')

  const response = await assert.client
    .post('/admin/categories')
    .send({name: 'test', position: 2, meat: true})
  response.assert(200).assert('content-type', /json/)

  const {category} = response.body
  assert.is(category.name, 'test')
  assert.is(category.position, 2)
  assert.is(category.meat, true)
})

test('POST /admin/categories/:id is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')

  const response = await assert.client
    .post('/admin/categories/1')
    .send({name: 'test', position: 106, meat: true})
  response.assert(200).assert('content-type', /json/)

  const {meat, name, position} = response.body.category
  assert.is(name, 'test')
  assert.is(position, 106)
  assert.is(meat, true)
})

test('DELETE /admin/categories/:id is a 200', async ({assert}) => {
  await assert.signIn('admin@example.com')

  const response = await assert.client
    .delete('/admin/categories/6')
    .send()
  response.assert(200).assert('content-type', /json/)

  const category = await Category.find(6)
  assert.is(category, null)
})
