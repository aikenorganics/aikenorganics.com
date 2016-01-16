import {UPDATE_CART} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_CART:
      const {product_id, quantity} = action
      return Object.assign({}, state, {[product_id]: quantity})

    default:
      return state
  }
}
