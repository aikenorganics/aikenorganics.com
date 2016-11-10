import 'ozymandias/client/errors'
import 'ozymandias/client/analytics'
import 'es6-promise/auto'
import React from 'react'
import store from './store'
import Routes from './routes'
import {render} from 'react-dom'

// The element to render components into.
const root = document.getElementById('root')

// Update the DOM
const update = () => render(<Routes {...store.getState()} />, root)

// Render when the store is updated.
store.subscribe(update)

// Kick the tires
if (root) update()
