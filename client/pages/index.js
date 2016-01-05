import page from 'page'
import React from 'react'
import {render} from 'react-dom'
import store from '../store'
import {changePath} from '../actions'

import Products from '../views/growers/products'

// The element to render components into.
const root = document.getElementById('root')

// A component route.
const route = (path, Component) => {
  page(path, (c) => changePath(c.path, Component))
}

// Render the component when the store is updated.
store.subscribe(() => {
  const state = store.getState()
  const {Component} = state
  render(<Component state={state}/>, root)
})

route('/growers/:id/products', Products)

// Kick the tires.
page({click: false, popstate: false})
