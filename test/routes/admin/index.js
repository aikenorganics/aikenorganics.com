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

test('/admin is a 401 signed out', function *(t) {
  const response = yield t.client.get('/admin').send()
  response.assert(401)
})

test('/admin is a 401 as a regular user', function *(t) {
  yield t.signIn('user@example.com')
  const response = yield t.client.get('/admin').send()
  response.assert(401)
})

test('/admin is a 404 as an admin', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin').send()
  response.assert(404)
})
