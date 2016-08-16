import assign from 'object-assign'
import {UPDATE_CART} from '../actions'

export default (state = null, {product_id, quantity, type}) => {
  switch (type) {
    case UPDATE_CART:
      const next = assign({}, state)
      if (quantity === 0) {
        delete next[product_id]
      } else {
        next[product_id] = quantity
      }
      return next

    default:
      return state
  }
}
