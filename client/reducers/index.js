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
import payments from './payments'
import product from './product'
import products from './products'
import productOrders from './product-orders'
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
  full: pass,
  grower,
  growers,
  location,
  locations,
  market,
  more: pass,
  order,
  orders: pass,
  oversold: pass,
  page: page,
  path: pass,
  payments,
  product,
  product_id: pass,
  products,
  productOrders,
  search: pass,
  status: pass,
  url: pass,
  user,
  users,
  version: pass
})

export default (state, action) => {
  if (action.type === REPLACE) state = action.state
  return reducer(state, action)
}
