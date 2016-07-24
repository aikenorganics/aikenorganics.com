import assign from 'object-assign'
import {UPDATE_USER} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_USER:
      if (!state || state.id !== action.id) return state
      return assign({}, state, action.values)

    default:
      return state
  }
}
