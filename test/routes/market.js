'use strict'

const test = require('../test')

// Index

test('GET /market is a 200', (t) => {
  t.agent
  .get('/market')
  .expect(200)
  .end(t.end)
})
