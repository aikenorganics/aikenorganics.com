import path from './path'
import products from './products'
import Component from './component'
import {combineReducers} from 'redux'

const pass = (state = null) => state

export default combineReducers({
  cart: pass,
  Component,
  grower: pass,
  market: pass,
  path,
  products,
  user: pass
})
