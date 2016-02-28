import {CANCEL_ORDER, UPDATE_ORDER} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case CANCEL_ORDER:
      if (!state || state.id !== action.id) return state
      return null

    case UPDATE_ORDER:
      if (!state || state.id !== action.id) return state
      return Object.assign({}, state, action.values)

    default:
      return state
  }
}
