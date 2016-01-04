import page from 'page'
import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import json from '../json'
import reducer from '../reducers'

import Products from '../views/growers/products'

const state = JSON.parse(document.getElementById('state').innerHTML)
const store = createStore(reducer, state)

const update = (product, values) => {
  return json(`/products/${product.id}`, {method: 'POST', body: values})
}

const root = document.getElementById('root')
store.subscribe(() => {
  const state = store.getState()
  const {Component} = state
  render(<Component state={state} actions={{update}}/>, root)
})

const route = (path, Component) => {
  page(path, () => {
    store.dispatch({
      type: 'NAVIGATE',
      Component: Products
    })
  })
}

route('/growers/:id/products', Products)

page({click: false, popstate: false})
