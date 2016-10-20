'use strict'

const test = require('../../test')

test('GET /admin/events is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.get('/admin/events').send()
  response.expect(200)
})
