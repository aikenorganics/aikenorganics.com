'use strict'

const csv = require('../../lib/csv')
const test = require('../test')

test('escape null values', async ({assert}) => {
  assert.is(csv.row(null, undefined), '"",""\n')
})

test('escape empty values', async ({assert}) => {
  assert.is(csv.row('', ' '), '""," "\n')
})

test('do not escape numbers', async ({assert}) => {
  assert.is(csv.row(1, 1.234), '1,1.234\n')
})

test('escape strings with commas, newlines, quotes', async ({assert}) => {
  assert.is(csv.row('"', ',', '\n', '\r'), '"""",",","\n","\r"\n')
})

test('do not escape strings without commas, newlines, quotes', async ({assert}) => {
  assert.is(csv.row('foo', 'foo bar'), 'foo,foo bar\n')
})
