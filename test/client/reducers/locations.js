import test from 'tape'
import freeze from 'deep-freeze'
import {
  REMOVE_LOCATION,
  UPDATE_LOCATION
} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update location - activate', (t) => {
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
  t.deepEqual(next.locations, [
    {id: 1, active: false},
    {id: 2, active: true}
  ])
  t.end()
})

test('update location - deactivate', (t) => {
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
  t.deepEqual(next.locations, [
    {id: 1, active: true},
    {id: 2, active: false}
  ])
  t.end()
})

test('remove location', (t) => {
  const state = freeze({locations: [{id: 1}, {id: 2}]})
  const next = reducer(state, {type: REMOVE_LOCATION, id: 2})
  t.deepEqual(next.locations, [{id: 1}])
  t.end()
})

test('no location to remove', (t) => {
  const state = freeze({})
  const next = reducer(state, {type: REMOVE_LOCATION, id: 2})
  t.deepEqual(next.locations, null)
  t.end()
})
