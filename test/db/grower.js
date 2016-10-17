'use strict'

const db = require('../../db')
const test = require('../test')

test('Grower#url prepends http://', function *(t) {
  const grower = new db.Grower({
    url: 'example.com'
  })
  t.equal(grower.url, 'http://example.com')
  t.end()
})

test('Grower#url handles https://', function *(t) {
  const grower = new db.Grower({
    url: 'https://example.com'
  })
  t.equal(grower.url, 'https://example.com')
  t.end()
})
