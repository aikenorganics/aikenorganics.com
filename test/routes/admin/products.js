'use strict'

const test = require('../../test')

test('/admin/products is a 401 signed out', function *(t) {
  const response = yield t.client.get('/admin/products').send()
  response.assert(401)
})

test('/admin/products?oversold=1 is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/products?oversold=1').send()
  response.assert(200)
})

test('/admin/products is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/products').send()
  response.assert(200)
})
