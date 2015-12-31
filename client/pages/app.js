import React from 'react'
import App from '../views/app'

export default (f) => {
  return (state, actions) => {
    const {cart, user, market, path} = state
    return <App cart={cart} market={market} user={user} path={path}>
      {f(state, actions)}
    </App>
  }
}
