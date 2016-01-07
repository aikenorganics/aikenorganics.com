import test from 'tape'
import freeze from 'deep-freeze'
import {CHANGE_PATH} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('change path', (t) => {
  const state = freeze({})
  const Component = freeze({})
  const next = reducer(state, {
    type: CHANGE_PATH,
    path: '/path',
    Component
  })
  t.is(next.Component, Component)
  t.end()
})
