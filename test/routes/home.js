'use strict'

const test = require('../test')

test('home page is a 200', async (t) => {
  const response = await t.client.get('/').send()
  response.assert(200)
})
