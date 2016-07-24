import assign from 'object-assign'
import {UPDATE_PRODUCT} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT:
      if (!state) return state
      return state.map((product) => {
        if (product.id !== action.id) return product
        return assign({}, product, action.values)
      })

    default:
      return state
  }
}
