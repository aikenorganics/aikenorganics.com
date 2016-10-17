'use strict'

const {Category} = require('../../../db')
const test = require('../../test')

test('GET /admin/categories/show is a 404 for missing ids', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/categories/123456789').send()
  response.expect(404)
})

test('GET /admin/categories/new is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/categories/new').send()
  response.expect(200)
})

test('GET /admin/categories/:id/edit is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/categories/1/edit').send()
  response.expect(200)
})

test('POST /admin/categories is a 200', function *(t) {
  yield t.signIn('admin@example.com')

  const response = yield t.client
    .post('/admin/categories')
    .send({name: 'test', position: 2, meat: true})
  response.expect(200).expect('content-type', /json/)

  const {category} = response.body
  t.is(category.name, 'test')
  t.is(category.position, 2)
  t.is(category.meat, true)
})

test('POST /admin/categories/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')

  const response = yield t.client
    .post('/admin/categories/1')
    .send({name: 'test', position: 106, meat: true})
  response.expect(200).expect('content-type', /json/)

  const {meat, name, position} = response.body.category
  t.is(name, 'test')
  t.is(position, 106)
  t.is(meat, true)
})

test('DELETE /admin/categories/:id is a 200', function *(t) {
  yield t.signIn('admin@example.com')

  const response = yield t.client
    .delete('/admin/categories/6')
    .send()
  response.expect(200).expect('content-type', /json/)

  const category = yield Category.find(6)
  t.is(category, null)
})
