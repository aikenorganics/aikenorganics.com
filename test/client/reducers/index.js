import test from 'tape'
import reducer from '../../../client/reducers'

test('return the default state', (t) => {
  const state = {}
  t.is(reducer(state, {type: undefined}), state)
  t.end()
})

test('NAVIGATE', (t) => {
  const state = {}
  const Component = {}
  const next = reducer(state, {type: 'NAVIGATE', Component})
  t.is(next.Component, Component)
  t.end()
})
