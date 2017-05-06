'use strict'

const test = require('../../test')

test('GET /admin/growers is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/growers').send()
  response.assert(200)
})

test('GET /admin/growers/orders is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/growers/orders').send()
  response.assert(200)
})

test('GET /admin/growers/:id is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/growers/1').send()
  response.assert(200)
})

test('GET /admin/growers/:id/users is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/growers/1/users').send()
  response.assert(200)
})
