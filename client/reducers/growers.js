import {UPDATE_GROWER} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_GROWER:
      return state.map((grower) => {
        if (grower.id !== action.id) return grower
        return Object.assign({}, grower, action.values)
      })

    default:
      return state
  }
}
