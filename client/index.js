import App from 'ozymandias/client/app'
import React from 'react'
import Routes from './routes'
import {hydrate} from 'react-dom'

hydrate(<App View={Routes} />, document.getElementById('root'))
