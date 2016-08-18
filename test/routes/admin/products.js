'use strict'

const test = require('../../test')

test('/admin/products?oversold=1 is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/products?oversold=1')
    .expect(200)
    .end(t.end)
  })
})

test('/admin/products is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/admin/products')
    .expect(200)
    .end(t.end)
  })
})
