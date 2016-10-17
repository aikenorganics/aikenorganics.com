'use strict'

const db = require('../../db')
const test = require('../test')

test('Grower#url prepends http://', function *(t) {
  const grower = new db.Grower({
    url: 'example.com'
  })
  t.is(grower.url, 'http://example.com')
})

test('Grower#url handles https://', function *(t) {
  const grower = new db.Grower({
    url: 'https://example.com'
  })
  t.is(grower.url, 'https://example.com')
})
