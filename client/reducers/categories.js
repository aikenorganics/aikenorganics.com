import assign from 'object-assign'
import {
  REMOVE_CATEGORY,
  UPDATE_CATEGORY
} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_CATEGORY:
      if (!state) return state
      return state.map((category) => {
        if (category.id !== action.id) return category
        return assign({}, category, action.values)
      })

    case REMOVE_CATEGORY:
      if (!state) return state
      return state.filter((category) => category.id !== action.id)

    default:
      return state
  }
}

