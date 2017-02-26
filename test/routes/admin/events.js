'use strict'

const test = require('../../test')

test('GET /admin/events is a 200', async (t) => {
  await t.signIn('admin@example.com')
  const response = await t.client.get('/admin/events').send()
  response.assert(200)
})
