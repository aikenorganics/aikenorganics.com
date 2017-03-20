import test from 'tape'
import freeze from 'deep-freeze'
import reducer from '../../../client/reducers'

test('default page to 1', (assert) => {
  const state = freeze({page: ''})
  const next = reducer(state, {})
  assert.is(next.page, 1)
  assert.end()
})

test('default page to 1', (assert) => {
  const state = freeze({page: '0'})
  const next = reducer(state, {})
  assert.is(next.page, 1)
  assert.end()
})

test('convert page to a number', (assert) => {
  const state = freeze({page: '1'})
  const next = reducer(state, {})
  assert.is(next.page, 1)
  assert.end()
})

test('convert page to a number', (assert) => {
  const state = freeze({page: '2'})
  const next = reducer(state, {})
  assert.is(next.page, 2)
  assert.end()
})
