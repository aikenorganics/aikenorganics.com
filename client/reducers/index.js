import cart from './cart'
import locations from './locations'
import products from './products'
import {combineReducers} from 'redux'

const pass = (state = null) => state

export default combineReducers({
  canEdit: pass,
  cart,
  categories: pass,
  category_id: pass,
  grower: pass,
  growers: pass,
  locations,
  market: pass,
  more: pass,
  page: pass,
  path: pass,
  products,
  search: pass,
  url: pass,
  user: pass,
  users: pass
})
