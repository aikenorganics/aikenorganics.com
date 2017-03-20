import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_PRODUCT} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update product - activate', (assert) => {
  const state = freeze({
    products: [
      {id: 1, active: false},
      {id: 2, active: false}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_PRODUCT,
    id: 2,
    values: {active: true}
  })
  assert.deepEqual(next.products, [
    {id: 1, active: false},
    {id: 2, active: true}
  ])
  assert.end()
})

test('update product - deactivate', (assert) => {
  const state = freeze({
    products: [
      {id: 1, active: true},
      {id: 2, active: true}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_PRODUCT,
    id: 2,
    values: {active: false}
  })
  assert.deepEqual(next.products, [
    {id: 1, active: true},
    {id: 2, active: false}
  ])
  assert.end()
})
