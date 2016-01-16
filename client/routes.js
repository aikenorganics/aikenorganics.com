import React from 'react'
import Router, {Route} from './router'

import App from './views/app'
import Admin from './views/admin/app'

import Products from './views/products/index'
import Product from './views/products/show'

import Grower from './views/growers/show'
import GrowerProducts from './views/growers/products'

import Locations from './views/admin/locations/index'
import EditLocation from './views/admin/locations/edit'
import NewLocation from './views/admin/locations/new'

export default (state) => {
  return <Router state={state}>
    <Route path='/admin/' Component={Admin}>
      <Route path='locations' Component={Locations}/>
      <Route path='locations/:location_id/edit' Component={EditLocation}/>
      <Route path='locations/new' Component={NewLocation}/>
    </Route>
    <Route path='/' Component={App}>
      <Route path='growers/:grower_id' Component={Grower}/>
      <Route path='growers/:grower_id/products' Component={GrowerProducts}/>
      <Route path='products' Component={Products}/>
      <Route path='products/:product_id' Component={Product}/>
    </Route>
  </Router>
}
