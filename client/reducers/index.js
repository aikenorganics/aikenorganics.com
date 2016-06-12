import {combineReducers} from 'redux'

import busy from './busy'
import cart from './cart'
import categories from './categories'
import currentUser from './current-user'
import errors from './errors'
import grower from './grower'
import growers from './growers'
import location from './location'
import locations from './locations'
import market from './market'
import order from './order'
import page from './page'
import product from './product'
import products from './products'
import user from './user'
import users from './users'
import {REPLACE} from '../actions/index'

const pass = (state = null) => state

const reducer = combineReducers({
  busy,
  canEdit: pass,
  cart,
  categories,
  category: pass,
  category_id: pass,
  currentUser,
  emails: pass,
  errors,
  grower,
  growers,
  location,
  locations,
  market,
  more: pass,
  order,
  oversold: pass,
  page: page,
  path: pass,
  product,
  products,
  search: pass,
  url: pass,
  user,
  users,
  version: pass
})

export default (state, action) => {
  if (action.type === REPLACE) state = action.state
  return reducer(state, action)
}
