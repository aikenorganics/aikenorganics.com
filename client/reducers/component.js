import {CHANGE_PATH} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case CHANGE_PATH:
      return action.Component
    default:
      return state
  }
}
