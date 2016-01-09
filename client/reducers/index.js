import cart from './cart'
import locations from './locations'
import products from './products'
import {combineReducers} from 'redux'

const pass = (state = null) => state

export default combineReducers({
  cart,
  grower: pass,
  locations,
  market: pass,
  path: pass,
  products,
  user: pass
})
