import {SET_ERRORS} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case SET_ERRORS:
      return action.errors

    default:
      return state
  }
}
