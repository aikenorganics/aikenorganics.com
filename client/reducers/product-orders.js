import assign from 'object-assign'
import {
  ADD_PRODUCT_ORDER,
  REMOVE_PRODUCT_ORDER,
  UPDATE_PRODUCT_ORDER
} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case ADD_PRODUCT_ORDER:
      if (!Array.isArray(state)) return state
      return state.concat(action.values)

    case UPDATE_PRODUCT_ORDER:
      if (!Array.isArray(state)) return state
      return state.map((productOrder) => {
        if (productOrder.id !== action.id) return productOrder
        return assign({}, productOrder, action.values)
      })

    case REMOVE_PRODUCT_ORDER:
      if (!Array.isArray(state)) return state
      return state.filter((productOrder) => productOrder.id !== action.id)

    default:
      return state
  }
}
