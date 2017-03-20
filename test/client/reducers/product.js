import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_PRODUCT} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update product - activate', (assert) => {
  const state = freeze({product: {id: 1, active: false}})
  const next = reducer(state, {
    type: UPDATE_PRODUCT,
    id: 1,
    values: {active: true}
  })
  assert.deepEqual(next.product, {id: 1, active: true})
  assert.end()
})

test('update product - wrong id', (assert) => {
  const state = freeze({product: {id: 1, active: false}})
  const next = reducer(state, {
    type: UPDATE_PRODUCT,
    id: 2,
    values: {active: true}
  })
  assert.deepEqual(next.product, {id: 1, active: false})
  assert.end()
})
