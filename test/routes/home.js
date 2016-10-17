'use strict'

const test = require('../test')

test('home page is a 200', function *(t) {
  const response = yield t.client.get('/').send()
  response.expect(200)
})
