'use strict'

let test = require('../../test')

test('/admin/products?oversold=1 is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/admin/products?oversold=1')
    .expect(200)
    .end(t.end)
  })
})

test('/admin/products is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/admin/products')
    .expect(200)
    .end(t.end)
  })
})
