import 'ozymandias/client/errors'
import 'ozymandias/client/analytics'
import 'es6-promise/auto'
import './to-locale-string'
import App from 'ozymandias/client/app'
import React from 'react'
import Routes from './routes'
import {render} from 'react-dom'

render(<App View={Routes} />, document.getElementById('root'))
