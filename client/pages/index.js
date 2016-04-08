import React from 'react'
import {render} from 'react-dom'
import store from '../store'
import Routes from '../routes'
import {navigate} from '../actions/index'

// The element to render components into.
const root = document.getElementById('root')

// Update the DOM
const update = () => render(<Routes {...store.getState()}/>, root)

// Render when the store is updated.
store.subscribe(update)

// Navigate on popstate.
window.addEventListener('popstate', () => {
  navigate(window.location.href, {push: false})
})

// Kick the tires
if (root) update()
