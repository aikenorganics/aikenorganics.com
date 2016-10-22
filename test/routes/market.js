'use strict'

const test = require('../test')

// Index

test('GET /market is a 200', function *(t) {
  const response = yield t.client.get('/market').send()
  response.assert(200)
})
