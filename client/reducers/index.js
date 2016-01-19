import busy from './busy'
import cart from './cart'
import errors from './errors'
import growers from './growers'
import locations from './locations'
import products from './products'
import users from './users'
import {combineReducers} from 'redux'

const pass = (state = null) => state

export default combineReducers({
  busy,
  canEdit: pass,
  cart,
  categories: pass,
  category_id: pass,
  emails: pass,
  errors,
  grower: pass,
  growers,
  locations,
  market: pass,
  more: pass,
  page: pass,
  path: pass,
  products,
  search: pass,
  url: pass,
  user: pass,
  users
})
