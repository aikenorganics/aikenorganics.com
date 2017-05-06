'use strict'

const test = require('../test')

test('home page is a 200', async ({assert}) => {
  const response = await assert.client.get('/').send()
  response.assert(200)
})
