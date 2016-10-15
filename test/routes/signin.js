'use strict'

const test = require('../test')

test('GET /signin is a 200', (t) => {
  t.agent.get('/signin').expect(200).end(t.end)
})

test('GET /signin/forgot is a 200', (t) => {
  t.agent.get('/signin/forgot').expect(200).end(t.end)
})
