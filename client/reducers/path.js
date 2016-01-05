import {CHANGE_PATH} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case CHANGE_PATH:
      return action.path || '/'
    default:
      return state
  }
}
