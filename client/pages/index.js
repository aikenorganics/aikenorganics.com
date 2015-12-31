import page from 'page'
import {render} from 'react-dom'
import json from '../json'

import Products from './growers/products'

const root = document.getElementById('root')
const state = JSON.parse(document.getElementById('state').innerHTML)

const update = (product, values) => {
  return json(`/products/${product.id}`, {method: 'POST', body: values})
}

page((c, next) => {
  state.path = c.path
  c.render = (component) => render(component, root)
  next()
})

page('/growers/:id/products', (c) => {
  c.render(Products(state, {update}))
})

page({click: false, popstate: false})
