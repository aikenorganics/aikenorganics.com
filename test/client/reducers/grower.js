import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_GROWER} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

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
