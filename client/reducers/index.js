import locations from './locations'
import products from './products'
import {combineReducers} from 'redux'

const pass = (state = null) => state

export default combineReducers({
  cart: pass,
  grower: pass,
  locations,
  market: pass,
  path: pass,
  products,
  user: pass
})
