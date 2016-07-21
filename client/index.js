import 'bugsnag-js'
import React from 'react'
import {render} from 'react-dom'
import store from './store'
import Routes from './routes'
import {navigate} from './actions/index'

// Bugs!
Object.assign(window.Bugsnag, store.getState().bugsnag)

// Bootstrap relies on window.jQuery
window.jQuery = require('jquery')
require('bootstrap')

// The element to render components into.
const root = document.getElementById('root')

// Update the DOM
const update = () => render(<Routes {...store.getState()}/>, root)

// Render when the store is updated.
store.subscribe(update)

// Navigate on popstate.
let hashChanged
window.addEventListener('popstate', () => {
  hashChanged = false
  setTimeout(() => {
    if (!hashChanged) navigate(window.location.href, {push: false})
  }, 0)
})

window.addEventListener('hashchange', () => {
  hashChanged = true
})

// Kick the tires
if (root) update()
