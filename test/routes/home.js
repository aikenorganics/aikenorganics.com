'use strict'

const test = require('../test')

test('home page is a 200', function *(t) {
  t.agent
  .get('/')
  .expect(200)
  .end(t.end)
})
