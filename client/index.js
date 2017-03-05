import 'ozymandias/client/errors'
import 'ozymandias/client/analytics'
import 'es6-promise/auto'
import React, {Component} from 'react'
import store from './store'
import Routes from './routes'
import {render} from 'react-dom'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
    store.subscribe(() => this.setState(store.getState()))
  }

  render () {
    return <Routes {...this.state} />
  }
}

render(<App />, document.getElementById('root'))
