'use strict'

const test = require('../../test')

test('/admin/products is a 401 signed out', async (assert) => {
  const response = await assert.client.get('/admin/products').send()
  response.assert(401)
})

test('/admin/products?oversold=1 is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/products?oversold=1').send()
  response.assert(200)
})

test('/admin/products is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/products').send()
  response.assert(200)
})
