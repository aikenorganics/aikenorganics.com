import test from 'tape'
import {params} from '../../client/url'

test('add to plain path', (t) => {
  t.is(params('/path', {x: 1, y: 2}), '/path?x=1&y=2')
  t.end()
})

test('replace existing values', (t) => {
  t.is(params('/path?x=3', {x: 1, y: 2}), '/path?x=1&y=2')
  t.end()
})

test('encodes values', (t) => {
  t.is(params('/path', {x: '/'}), '/path?x=%2F')
  t.end()
})

test('exclude null values', (t) => {
  t.is(params('/path?x=1', {x: null}), '/path')
  t.is(params('/path?x=1', {x: undefined}), '/path')
  t.is(params('/path?x=1', {x: undefined, y: 2}), '/path?y=2')
  t.end()
})
