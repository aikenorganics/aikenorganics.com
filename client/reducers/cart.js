import assign from 'object-assign'
import {UPDATE_CART} from '../actions'

export default (state = null, {productId, quantity, type}) => {
  switch (type) {
    case UPDATE_CART:
      const next = assign({}, state)
      if (quantity === 0) {
        delete next[productId]
      } else {
        next[productId] = quantity
      }
      return next

    default:
      return state
  }
}
