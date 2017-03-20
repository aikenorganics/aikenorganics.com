import test from 'tape'
import {params} from '../../client/url'

test('add to plain path', (assert) => {
  assert.is(params('/path', {x: 1, y: 2}), '/path?x=1&y=2')
  assert.end()
})

test('replace existing values', (assert) => {
  assert.is(params('/path?x=3', {x: 1, y: 2}), '/path?x=1&y=2')
  assert.end()
})

test('encodes values', (assert) => {
  assert.is(params('/path', {'/': '/'}), '/path?%2F=%2F')
  assert.end()
})

test('exclude null values', (assert) => {
  assert.is(params('/path?x=1', {x: null}), '/path')
  assert.is(params('/path?x=1', {x: undefined}), '/path')
  assert.is(params('/path?x=1', {x: undefined, y: 2}), '/path?y=2')
  assert.end()
})

test('exlude empty arrays', (assert) => {
  assert.is(params('/path', {x: []}), '/path')
  assert.is(params('/path?y=1', {x: []}), '/path?y=1')
  assert.end()
})
