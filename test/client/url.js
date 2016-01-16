import test from 'tape'
import {withParams} from '../../client/url'

test('add to plain path', (t) => {
  t.is(withParams('/path', {x: 1, y: 2}), '/path?x=1&y=2')
  t.end()
})

test('replace existing values', (t) => {
  t.is(withParams('/path?x=3', {x: 1, y: 2}), '/path?x=1&y=2')
  t.end()
})
