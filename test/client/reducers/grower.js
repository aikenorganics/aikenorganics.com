import test from 'tape'
import freeze from 'deep-freeze'
import reducer from '../../../client/reducers'
import {
  CREATE_USER_GROWER,
  REMOVE_USER_GROWER,
  UPDATE_GROWER
} from '../../../client/actions'

test('update grower', (t) => {
  const state = freeze({grower: {id: 1, active: false}})
  const next = reducer(state, {
    type: UPDATE_GROWER,
    id: 1,
    values: {active: true}
  })
  t.deepEqual(next.grower, {id: 1, active: true})
  t.end()
})

test('update grower - wrong id', (t) => {
  const state = freeze({grower: {id: 1, active: false}})
  const next = reducer(state, {
    type: UPDATE_GROWER,
    id: 2,
    values: {active: true}
  })
  t.deepEqual(next.grower, {id: 1, active: false})
  t.end()
})

test('create UserGrower', (t) => {
  const state = freeze({grower: {id: 1, userGrowers: [{id: 1}]}})
  const next = reducer(state, {
    type: CREATE_USER_GROWER,
    userGrower: {id: 2}
  })
  t.deepEqual(next.grower, {id: 1, userGrowers: [{id: 1}, {id: 2}]})
  t.end()
})

test('create UserGrower without userGrowers', (t) => {
  const state = freeze({grower: {id: 1}})
  const next = reducer(state, {
    type: CREATE_USER_GROWER,
    userGrower: {id: 2}
  })
  t.deepEqual(next.grower, {id: 1, userGrowers: [{id: 2}]})
  t.end()
})

test('remove UserGrower', (t) => {
  const state = freeze({grower: {id: 1, userGrowers: [{id: 1}, {id: 2}]}})
  const next = reducer(state, {
    type: REMOVE_USER_GROWER,
    id: 1
  })
  t.deepEqual(next.grower, {id: 1, userGrowers: [{id: 2}]})
  t.end()
})

test('remove UserGrower without userGrowers', (t) => {
  const state = freeze({grower: {id: 1}})
  const next = reducer(state, {
    type: REMOVE_USER_GROWER,
    id: 1
  })
  t.deepEqual(next.grower, {id: 1})
  t.end()
})
