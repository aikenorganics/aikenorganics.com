import test from 'tape'
import freeze from 'deep-freeze'
import {
  REMOVE_LOCATION,
  UPDATE_LOCATION
} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update location - activate', (assert) => {
  const state = freeze({
    locations: [
      {id: 1, active: false},
      {id: 2, active: false}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_LOCATION,
    id: 2,
    values: {active: true}
  })
  assert.deepEqual(next.locations, [
    {id: 1, active: false},
    {id: 2, active: true}
  ])
  assert.end()
})

test('update location - deactivate', (assert) => {
  const state = freeze({
    locations: [
      {id: 1, active: true},
      {id: 2, active: true}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_LOCATION,
    id: 2,
    values: {active: false}
  })
  assert.deepEqual(next.locations, [
    {id: 1, active: true},
    {id: 2, active: false}
  ])
  assert.end()
})

test('remove location', (assert) => {
  const state = freeze({locations: [{id: 1}, {id: 2}]})
  const next = reducer(state, {type: REMOVE_LOCATION, id: 2})
  assert.deepEqual(next.locations, [{id: 1}])
  assert.end()
})

test('no location to remove', (assert) => {
  const state = freeze({})
  const next = reducer(state, {type: REMOVE_LOCATION, id: 2})
  assert.deepEqual(next.locations, null)
  assert.end()
})
