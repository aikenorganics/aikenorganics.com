import {UPDATE_CART} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_CART:
      return Object.assign({}, state, action.values)

    default:
      return state
  }
}
