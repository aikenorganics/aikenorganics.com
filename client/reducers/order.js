import {CANCEL_ORDER, CREATE_PAYMENT, UPDATE_ORDER} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case CANCEL_ORDER:
      if (!state || state.id !== action.id) return state
      return null

    case CREATE_PAYMENT:
      if (!state || state.id !== action.id) return state
      return Object.assign({}, state, {
        payments: state.payments.concat([action.payment])
      })

    case UPDATE_ORDER:
      if (!state || state.id !== action.id) return state
      return Object.assign({}, state, action.values)

    default:
      return state
  }
}
