import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_LOCATION} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update location - activate', (assert) => {
  const state = freeze({location: {id: 2, active: false}})
  const next = reducer(state, {
    type: UPDATE_LOCATION,
    id: 2,
    values: {active: true}
  })
  assert.deepEqual(next.location, {id: 2, active: true})
  assert.end()
})

test('update location - deactivate', (assert) => {
  const state = freeze({location: {id: 2, active: true}})
  const next = reducer(state, {
    type: UPDATE_LOCATION,
    id: 2,
    values: {active: false}
  })
  assert.deepEqual(next.location, {id: 2, active: false})
  assert.end()
})

test('update location - unequal id', (assert) => {
  const state = freeze({location: {id: 2, active: true}})
  const next = reducer(state, {
    type: UPDATE_LOCATION,
    id: 1,
    values: {active: false}
  })
  assert.deepEqual(next.location, {id: 2, active: true})
  assert.end()
})
