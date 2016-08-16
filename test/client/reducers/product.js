import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_PRODUCT} from '../../../client/actions'
import reducer from '../../../client/reducers/index'

test('update product - activate', (t) => {
  const state = freeze({product: {id: 1, active: false}})
  const next = reducer(state, {
    type: UPDATE_PRODUCT,
    id: 1,
    values: {active: true}
  })
  t.deepEqual(next.product, {id: 1, active: true})
  t.end()
})

test('update product - wrong id', (t) => {
  const state = freeze({product: {id: 1, active: false}})
  const next = reducer(state, {
    type: UPDATE_PRODUCT,
    id: 2,
    values: {active: true}
  })
  t.deepEqual(next.product, {id: 1, active: false})
  t.end()
})
