import {
  REMOVE_LOCATION,
  UPDATE_LOCATION
} from '../actions'

export default (state = null, action) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      return state.map((location) => {
        if (location.id !== action.id) return location
        return Object.assign({}, location, action.values)
      })

    case REMOVE_LOCATION:
      return state.filter((location) => location.id !== action.id)

    default:
      return state
  }
}
