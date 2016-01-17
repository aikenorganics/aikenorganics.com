import {UPDATE_USER} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return state.map((user) => {
        if (user.id !== action.id) return user
        return Object.assign({}, user, action.values)
      })

    default:
      return state
  }
}

