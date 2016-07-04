import test from 'tape'
import freeze from 'deep-freeze'
import {
  ADD_PRODUCT_ORDER,
  REMOVE_PRODUCT_ORDER,
  UPDATE_PRODUCT_ORDER
} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('add productOrder', (t) => {
  const state = freeze({
    productOrders: [
      {id: 1, cost: '5.50', quantity: 3}
    ]
  })
  const next = reducer(state, {
    type: ADD_PRODUCT_ORDER,
    values: {id: 2, cost: '4.50', quantity: 2}
  })
  t.deepEqual(next.productOrders, [
    {id: 1, cost: '5.50', quantity: 3},
    {id: 2, cost: '4.50', quantity: 2}
  ])
  t.end()
})

test('update productOrder', (t) => {
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
  t.deepEqual(next.productOrders, [
    {id: 1, cost: '6.25', quantity: 4},
    {id: 2, cost: '4.50', quantity: 2}
  ])
  t.end()
})

test('remove productOrder', (t) => {
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
  t.deepEqual(next.productOrders, [
    {id: 2, cost: '4.50', quantity: 2}
  ])
  t.end()
})
