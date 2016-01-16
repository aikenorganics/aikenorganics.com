import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_CART} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update cart', (t) => {
  const state = freeze({cart: {1: 3, 2: 5}})
  const next = reducer(state, {
    type: UPDATE_CART,
    product_id: 2,
    quantity: 6
  })
  t.deepEqual(next.cart, {1: 3, 2: 6})
  t.end()
})
