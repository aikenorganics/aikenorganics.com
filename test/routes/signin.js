'use strict'

const test = require('../test')

test('GET /signin/forgot is a 200', (t) => {
  t.request()
  .get('/signin/forgot')
  .expect(200)
  .end(t.end)
})
