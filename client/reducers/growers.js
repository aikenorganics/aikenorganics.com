import assign from 'object-assign'
import {UPDATE_GROWER} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_GROWER:
      if (!state) return state
      return state.map((grower) => {
        if (grower.id !== action.id) return grower
        return assign({}, grower, action.values)
      })

    default:
      return state
  }
}
