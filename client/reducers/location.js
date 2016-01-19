import {UPDATE_LOCATION} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      if (!state || state.id !== action.id) return state
      return Object.assign({}, state, action.values)

    default:
      return state
  }
}

