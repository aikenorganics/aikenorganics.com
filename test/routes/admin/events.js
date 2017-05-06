'use strict'

const test = require('../../test')

test('GET /admin/events is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/admin/events').send()
  response.assert(200)
})
