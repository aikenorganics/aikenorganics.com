import assign from 'object-assign'
import {UPDATE_CART} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_CART:
      const {product_id, quantity} = action
      const next = assign({}, state, {[product_id]: quantity})
      if (quantity === 0) delete next[product_id]
      return next

    default:
      return state
  }
}
