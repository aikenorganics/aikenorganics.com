'use strict'

const {Grower} = require('../../db')
const test = require('../test')

test('allow undefined url', async ({assert}) => {
  const grower = new Grower({url: undefined})
  grower.validate()
  assert.ok(!grower.errors.url)
})

test('allow null url', async ({assert}) => {
  const grower = new Grower({url: null})
  grower.validate()
  assert.ok(!grower.errors.url)
})

test('allow blank url', async ({assert}) => {
  const grower = new Grower({url: ''})
  grower.validate()
  assert.ok(!grower.errors.url)
})

test('allow space only url', async ({assert}) => {
  const grower = new Grower({url: '    '})
  assert.is(grower.url, '')
  grower.validate()
  assert.ok(!grower.errors.url)
})

test('trim the url', async ({assert}) => {
  const grower = new Grower({url: '  https://example.com  '})
  assert.is(grower.url, 'https://example.com')
  grower.validate()
  assert.ok(!grower.errors.url)
})

test('ensure http(s) url', async ({assert}) => {
  const grower = new Grower({url: 'example.com'})
  grower.validate()
  assert.deepEqual(grower.errors.url, ['URL must start with http(s)://'])
})

test('http urls are valid', async ({assert}) => {
  const grower = new Grower({url: 'http://example.com'})
  grower.validate()
  assert.ok(!grower.errors.url)
})

test('https urls are valid', async ({assert}) => {
  const grower = new Grower({url: 'https://example.com'})
  grower.validate()
  assert.ok(!grower.errors.url)
})
