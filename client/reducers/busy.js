import {BUSY, DONE} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case BUSY:
      return true

    case DONE:
      return false

    default:
      return state
  }
}

