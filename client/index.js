import './errors'
import 'ozymandias/client/analytics'
import 'es6-promise/auto'
import React from 'react'
import store from './store'
import Routes from './routes'
import {render} from 'react-dom'
import {navigate} from './actions'

// The element to render components into.
const root = document.getElementById('root')

// Update the DOM
const update = () => render(<Routes {...store.getState()} />, root)

// Render when the store is updated.
store.subscribe(update)

// Navigate on popstate.
window.addEventListener('popstate', () => {
  // The popstate event is also fired on hashchange, so make sure the path has
  // actually changed!
  if (store.getState().path !== window.location.pathname) {
    navigate(window.location.href, {push: false})
  }
})

// Kick the tires
if (root) update()
