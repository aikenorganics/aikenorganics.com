'use strict'

const test = require('../../test')

test('GET /admin/events is a 200', async ({assert, client}) => {
  await assert.signIn('admin@example.com')
  const response = await client.get('/admin/events').send()
  response.assert(200)
})
