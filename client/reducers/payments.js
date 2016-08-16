import {ADD_PAYMENT} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case ADD_PAYMENT:
      if (!Array.isArray(state)) return state
      return state.concat(action.values)

    default:
      return state
  }
}
