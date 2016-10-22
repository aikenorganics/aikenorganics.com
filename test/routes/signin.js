'use strict'

const test = require('../test')

test('GET /signin is a 200', function *(t) {
  const response = yield t.client.get('/signin').send()
  response.assert(200)
})

test('GET /signin/forgot is a 200', function *(t) {
  const response = yield t.client.get('/signin/forgot').send()
  response.assert(200)
})
