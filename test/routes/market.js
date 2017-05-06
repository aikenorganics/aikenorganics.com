'use strict'

const test = require('../test')

// Index

test('GET /market is a 200', async ({assert, client}) => {
  const response = await client.get('/market').send()
  response.assert(200)
})
