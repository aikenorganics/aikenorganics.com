'use strict'

const test = require('../test')

test('home page is a 200', async ({assert, client}) => {
  const response = await client.get('/').send()
  response.assert(200)
})
