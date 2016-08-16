import test from 'tape'
import freeze from 'deep-freeze'
import reducer from '../../../client/reducers'

test('default page to 1', (t) => {
  const state = freeze({page: ''})
  const next = reducer(state, {})
  t.is(next.page, 1)
  t.end()
})

test('default page to 1', (t) => {
  const state = freeze({page: '0'})
  const next = reducer(state, {})
  t.is(next.page, 1)
  t.end()
})

test('convert page to a number', (t) => {
  const state = freeze({page: '1'})
  const next = reducer(state, {})
  t.is(next.page, 1)
  t.end()
})

test('convert page to a number', (t) => {
  const state = freeze({page: '2'})
  const next = reducer(state, {})
  t.is(next.page, 2)
  t.end()
})
