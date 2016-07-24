import assign from 'object-assign'
import {
  CANCEL_ORDER,
  UPDATE_ORDER
} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case CANCEL_ORDER:
      if (!state || state.id !== action.id) return state
      return null

    case UPDATE_ORDER:
      if (!state || state.id !== action.id) return state
      const next = assign({}, state, action.values)
      if (next.location_id == null) delete next.location
      return next

    default:
      return state
  }
}
