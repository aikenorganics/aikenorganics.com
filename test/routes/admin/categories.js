'use strict'

const {Category} = require('../../../db')
const test = require('../../test')

test('GET /admin/categories/show is a 404 for missing ids', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/categories/123456789').send()
  response.assert(404)
})

test('GET /admin/categories/new is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/categories/new').send()
  response.assert(200)
})

test('GET /admin/categories/:id/edit is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/categories/1/edit').send()
  response.assert(200)
})

test('POST /admin/categories is a 200', async (t) => {
  await t.signIn('admin@example.com')

  const response = await t.client
    .post('/admin/categories')
    .send({name: 'test', position: 2, meat: true})
  response.assert(200).assert('content-type', /json/)

  const {category} = response.body
  t.is(category.name, 'test')
  t.is(category.position, 2)
  t.is(category.meat, true)
})

test('POST /admin/categories/:id is a 200', async (t) => {
  await t.signIn('admin@example.com')

  const response = await t.client
    .post('/admin/categories/1')
    .send({name: 'test', position: 106, meat: true})
  response.assert(200).assert('content-type', /json/)

  const {meat, name, position} = response.body.category
  t.is(name, 'test')
  t.is(position, 106)
  t.is(meat, true)
})

test('DELETE /admin/categories/:id is a 200', async (t) => {
  await t.signIn('admin@example.com')

  const response = await t.client
    .delete('/admin/categories/6')
    .send()
  response.assert(200).assert('content-type', /json/)

  const category = await Category.find(6)
  t.is(category, null)
})
