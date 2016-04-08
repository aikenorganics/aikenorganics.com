import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_LOCATION} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('update location - activate', (t) => {
  const state = freeze({location: {id: 2, active: false}})
  const next = reducer(state, {
    type: UPDATE_LOCATION,
    id: 2,
    values: {active: true}
  })
  t.deepEqual(next.location, {id: 2, active: true})
  t.end()
})

test('update location - deactivate', (t) => {
  const state = freeze({location: {id: 2, active: true}})
  const next = reducer(state, {
    type: UPDATE_LOCATION,
    id: 2,
    values: {active: false}
  })
  t.deepEqual(next.location, {id: 2, active: false})
  t.end()
})

test('update location - unequal id', (t) => {
  const state = freeze({location: {id: 2, active: true}})
  const next = reducer(state, {
    type: UPDATE_LOCATION,
    id: 1,
    values: {active: false}
  })
  t.deepEqual(next.location, {id: 2, active: true})
  t.end()
})
