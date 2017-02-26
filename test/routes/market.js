'use strict'

const test = require('../test')

// Index

test('GET /market is a 200', async (t) => {
  const response = await t.client.get('/market').send()
  response.assert(200)
})
