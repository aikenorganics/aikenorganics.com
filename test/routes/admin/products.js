'use strict'

const test = require('../../test')

test('/admin/products is a 401 signed out', function *(t) {
  t.agent.get('/admin/products').expect(401).end(t.end)
})

test('/admin/products?oversold=1 is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent
  .get('/admin/products?oversold=1')
  .expect(200)
  .end(t.end)
})

test('/admin/products is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  t.agent
  .get('/admin/products')
  .expect(200)
  .end(t.end)
})
