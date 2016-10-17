'use strict'

const test = require('../test')

test('GET /signin is a 200', function *(t) {
  const response = yield t.client.get('/signin').send()
  response.expect(200)
})

test('GET /signin/forgot is a 200', function *(t) {
  const response = yield t.client.get('/signin/forgot').send()
  response.expect(200)
})
