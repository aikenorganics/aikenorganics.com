'use strict'

const test = require('../test')

test('GET /session/signin is a 200', async (t) => {
  const response = await t.client.get('/session/signin').send()
  response.assert(200)
})

test('GET /session/forgot is a 200', async (t) => {
  const response = await t.client.get('/session/forgot').send()
  response.assert(200)
})
