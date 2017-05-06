'use strict'

const test = require('../test')

// Index

test('GET /market is a 200', async (assert) => {
  const response = await assert.client.get('/market').send()
  response.assert(200)
})
