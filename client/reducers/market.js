import assign from 'object-assign'
import {UPDATE_MARKET} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_MARKET:
      return assign({}, state, action.values)

    default:
      return state
  }
}
