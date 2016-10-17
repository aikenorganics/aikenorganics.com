'use strict'

const test = require('../test')

// Index

test('GET /market is a 200', function *(t) {
  t.agent
  .get('/market')
  .expect(200)
  .end(t.end)
})
