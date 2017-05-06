'use strict'

require('./users')
require('./events')
require('./market')
require('./orders')
require('./growers')
require('./products')
require('./locations')
require('./categories')
require('./user-growers')
require('./product-orders')

const test = require('../../test')

test('/admin is a 401 signed out', async (assert) => {
  const response = await assert.client.get('/admin').send()
  response.assert(401)
})

test('/admin is a 401 as a regular user', async (assert) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/admin').send()
  response.assert(401)
})

test('/admin is a 404 as an admin', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin').send()
  response.assert(404)
})
