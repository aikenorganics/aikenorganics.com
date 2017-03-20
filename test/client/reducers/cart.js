import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_CART} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update cart', (assert) => {
  const state = freeze({cart: {1: 3, 2: 5}})
  const next = reducer(state, {
    type: UPDATE_CART,
    productId: 2,
    quantity: 6
  })
  assert.deepEqual(next.cart, {1: 3, 2: 6})
  assert.end()
})

test('update cart with 0', (assert) => {
  const state = freeze({cart: {1: 3, 2: 5}})
  const next = reducer(state, {
    type: UPDATE_CART,
    productId: 1,
    quantity: 0
  })
  assert.deepEqual(next.cart, {2: 5})
  assert.end()
})
