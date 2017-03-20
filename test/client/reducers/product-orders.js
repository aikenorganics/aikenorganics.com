import test from 'tape'
import freeze from 'deep-freeze'
import {
  ADD_PRODUCT_ORDER,
  REMOVE_PRODUCT_ORDER,
  UPDATE_PRODUCT_ORDER
} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('add productOrder', (assert) => {
  const state = freeze({
    productOrders: [
      {id: 1, cost: '5.50', quantity: 3}
    ]
  })
  const next = reducer(state, {
    type: ADD_PRODUCT_ORDER,
    values: {id: 2, cost: '4.50', quantity: 2}
  })
  assert.deepEqual(next.productOrders, [
    {id: 1, cost: '5.50', quantity: 3},
    {id: 2, cost: '4.50', quantity: 2}
  ])
  assert.end()
})

test('update productOrder', (assert) => {
  const state = freeze({
    productOrders: [
      {id: 1, cost: '5.50', quantity: 3},
      {id: 2, cost: '4.50', quantity: 2}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_PRODUCT_ORDER,
    id: 1,
    values: {
      cost: '6.25',
      quantity: 4
    }
  })
  assert.deepEqual(next.productOrders, [
    {id: 1, cost: '6.25', quantity: 4},
    {id: 2, cost: '4.50', quantity: 2}
  ])
  assert.end()
})

test('remove productOrder', (assert) => {
  const state = freeze({
    productOrders: [
      {id: 1, cost: '5.50', quantity: 3},
      {id: 2, cost: '4.50', quantity: 2}
    ]
  })
  const next = reducer(state, {
    type: REMOVE_PRODUCT_ORDER,
    id: 1
  })
  assert.deepEqual(next.productOrders, [
    {id: 2, cost: '4.50', quantity: 2}
  ])
  assert.end()
})
