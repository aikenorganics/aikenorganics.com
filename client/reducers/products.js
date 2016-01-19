import {UPDATE_PRODUCT} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT:
      if (!state) return state
      return state.map((product) => {
        if (product.id !== action.id) return product
        return Object.assign({}, product, action.values)
      })

    default:
      return state
  }
}
