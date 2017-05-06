'use strict'

const test = require('../test')

test('GET /session/signin is a 200', async ({assert}) => {
  const response = await assert.client.get('/session/signin').send()
  response.assert(200)
})

test('GET /session/forgot is a 200', async ({assert}) => {
  const response = await assert.client.get('/session/forgot').send()
  response.assert(200)
})
