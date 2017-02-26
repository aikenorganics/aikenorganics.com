'use strict'

const test = require('../../test')

test('/admin/products is a 401 signed out', async (t) => {
  const response = await t.client.get('/admin/products').send()
  response.assert(401)
})

test('/admin/products?oversold=1 is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/products?oversold=1').send()
  response.assert(200)
})

test('/admin/products is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/products').send()
  response.assert(200)
})
