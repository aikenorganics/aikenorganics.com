import React from 'react'
import Router, {Route} from './router'

import Products from './views/growers/products'

export default ({state}) => {
  return <Router state={state}>
    <Route path='/growers/:id/products' Component={Products}/>
  </Router>
}
