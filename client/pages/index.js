import React from 'react'
import {render} from 'react-dom'
import store from '../store'
import Routes from '../routes'

// The element to render components into.
const root = document.getElementById('root')

// Update the DOM
const update = () => render(<Routes state={store.getState()}/>, root)

// Render when the store is updated.
store.subscribe(update)

// Kick the tires
if (root) update()
