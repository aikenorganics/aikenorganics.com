import assign from 'object-assign'
import {
  CREATE_USER_GROWER,
  REMOVE_USER_GROWER,
  UPDATE_GROWER
} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case CREATE_USER_GROWER:
      if (!state) return state
      return assign({}, state, {
        userGrowers: (state.userGrowers || []).concat([action.userGrower])
      })

    case REMOVE_USER_GROWER:
      if (!state || !state.userGrowers) return state
      return assign({}, state, {
        userGrowers: state.userGrowers.filter(({id}) => {
          return id !== action.id
        })
      })

    case UPDATE_GROWER:
      if (!state || state.id !== action.id) return state
      return assign({}, state, action.values)

    default:
      return state
  }
}
