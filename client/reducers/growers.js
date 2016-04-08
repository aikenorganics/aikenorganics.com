import {UPDATE_GROWER} from '../actions/index'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_GROWER:
      if (!state) return state
      return state.map((grower) => {
        if (grower.id !== action.id) return grower
        return Object.assign({}, grower, action.values)
      })

    default:
      return state
  }
}
