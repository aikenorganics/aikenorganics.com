'use strict'

const test = require('../test')
const app = require('../../app')

test('home page is a 200', (t) => {
  t.request(app)
  .get('/')
  .expect(200)
  .end(t.end)
})
