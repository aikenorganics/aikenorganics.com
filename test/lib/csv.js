'use strict'

const csv = require('../../lib/csv')
const test = require('tape')

test('escape null values', (t) => {
  t.is(csv.row(null, undefined), '"",""\n')
  t.end()
})

test('escape empty values', (t) => {
  t.is(csv.row('', ' '), '""," "\n')
  t.end()
})

test('do not escape numbers', (t) => {
  t.is(csv.row(1, 1.234), '1,1.234\n')
  t.end()
})

test('escape strings with commas, newlines, quotes', (t) => {
  t.is(csv.row('"', ',', '\n', '\r'), '"""",",","\n","\r"\n')
  t.end()
})

test('do not escape strings without commas, newlines, quotes', (t) => {
  t.is(csv.row('foo', 'foo bar'), 'foo,foo bar\n')
  t.end()
})
