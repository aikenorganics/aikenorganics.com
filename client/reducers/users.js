import assign from 'object-assign'
import {UPDATE_USER} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_USER:
      if (!state) return state
      return state.map((user) => {
        if (user.id !== action.id) return user
        return assign({}, user, action.values)
      })

    default:
      return state
  }
}
