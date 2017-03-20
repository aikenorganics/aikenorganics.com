import test from 'tape'
import freeze from 'deep-freeze'
import reducer from '../../../client/reducers'
import {
  CREATE_USER_GROWER,
  REMOVE_USER_GROWER,
  UPDATE_GROWER
} from '../../../client/actions'

test('update grower', (assert) => {
  const state = freeze({grower: {id: 1, active: false}})
  const next = reducer(state, {
    type: UPDATE_GROWER,
    id: 1,
    values: {active: true}
  })
  assert.deepEqual(next.grower, {id: 1, active: true})
  assert.end()
})

test('update grower - wrong id', (assert) => {
  const state = freeze({grower: {id: 1, active: false}})
  const next = reducer(state, {
    type: UPDATE_GROWER,
    id: 2,
    values: {active: true}
  })
  assert.deepEqual(next.grower, {id: 1, active: false})
  assert.end()
})

test('create UserGrower', (assert) => {
  const state = freeze({grower: {id: 1, userGrowers: [{id: 1}]}})
  const next = reducer(state, {
    type: CREATE_USER_GROWER,
    userGrower: {id: 2}
  })
  assert.deepEqual(next.grower, {id: 1, userGrowers: [{id: 1}, {id: 2}]})
  assert.end()
})

test('create UserGrower without userGrowers', (assert) => {
  const state = freeze({grower: {id: 1}})
  const next = reducer(state, {
    type: CREATE_USER_GROWER,
    userGrower: {id: 2}
  })
  assert.deepEqual(next.grower, {id: 1, userGrowers: [{id: 2}]})
  assert.end()
})

test('remove UserGrower', (assert) => {
  const state = freeze({grower: {id: 1, userGrowers: [{id: 1}, {id: 2}]}})
  const next = reducer(state, {
    type: REMOVE_USER_GROWER,
    id: 1
  })
  assert.deepEqual(next.grower, {id: 1, userGrowers: [{id: 2}]})
  assert.end()
})

test('remove UserGrower without userGrowers', (assert) => {
  const state = freeze({grower: {id: 1}})
  const next = reducer(state, {
    type: REMOVE_USER_GROWER,
    id: 1
  })
  assert.deepEqual(next.grower, {id: 1})
  assert.end()
})
