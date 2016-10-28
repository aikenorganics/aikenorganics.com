import {combineReducers} from 'redux'

import {
  busy,
  errors,
  message
} from 'ozymandias/client/reducers'

import cart from './reducers/cart'
import categories from './reducers/categories'
import currentUser from './reducers/current-user'
import grower from './reducers/grower'
import growers from './reducers/growers'
import location from './reducers/location'
import locations from './reducers/locations'
import market from './reducers/market'
import order from './reducers/order'
import page from './reducers/page'
import payments from './reducers/payments'
import product from './reducers/product'
import products from './reducers/products'
import productOrders from './reducers/product-orders'
import user from './reducers/user'
import users from './reducers/users'
import {REPLACE} from './actions'

const pass = (state = null) => state

const reducer = combineReducers({
  admin: pass,
  bugsnag: pass,
  busy,
  canEdit: pass,
  cart,
  categories,
  category: pass,
  categoryId: pass,
  currentUser,
  email: pass,
  emails: pass,
  errors,
  events: pass,
  expired: pass,
  full: pass,
  grower,
  growers,
  location,
  locationId: pass,
  locations,
  market,
  message,
  more: pass,
  newsHtml: pass,
  order,
  orders: pass,
  oversold: pass,
  page: page,
  path: pass,
  payments,
  product,
  productId: pass,
  products,
  productOrders,
  search: pass,
  status: pass,
  statusCode: pass,
  stripeKey: pass,
  token: pass,
  url: pass,
  user,
  userId: pass,
  users,
  version: pass
})

export default (state, action) => {
  if (action.type === REPLACE) state = action.state
  return reducer(state, action)
}
