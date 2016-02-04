import React from 'react'
import Router, {Route} from './router'

import App from './views/app'
import Admin from './views/admin/app'

import Product from './views/products/show'
import Products from './views/products/index'
import NewProduct from './views/products/new'
import EditProduct from './views/products/edit'

import Grower from './views/growers/show'
import Growers from './views/growers/index'
import NewGrower from './views/growers/new'
import EditGrower from './views/growers/edit'
import GrowerOrders from './views/growers/orders'
import GrowerProducts from './views/growers/products'

import Locations from './views/admin/locations/index'
import EditLocation from './views/admin/locations/edit'
import NewLocation from './views/admin/locations/new'

import Emails from './views/admin/users/emails'
import Users from './views/admin/users/index'
import NewUser from './views/admin/users/new'
import EditUser from './views/admin/users/edit'

import Market from './views/admin/market/index'

import AdminGrowers from './views/admin/growers/index'
import AdminGrowersOrders from './views/admin/growers/orders'

export default (state) => {
  return <Router state={state}>
    <Route path='/admin/' Component={Admin}>
      <Route path='growers' Component={AdminGrowers}/>
      <Route path='growers/orders' Component={AdminGrowersOrders}/>
      <Route path='locations' Component={Locations}/>
      <Route path='locations/:location_id/edit' Component={EditLocation}/>
      <Route path='locations/new' Component={NewLocation}/>
      <Route path='market' Component={Market}/>
      <Route path='users' Component={Users}/>
      <Route path='users/new' Component={NewUser}/>
      <Route path='users/emails' Component={Emails}/>
      <Route path='users/:user_id/edit' Component={EditUser}/>
    </Route>
    <Route path='/' Component={App}>
      <Route path='growers' Component={Growers}/>
      <Route path='growers/new' Component={NewGrower}/>
      <Route path='growers/:grower_id' Component={Grower}/>
      <Route path='growers/:grower_id/edit' Component={EditGrower}/>
      <Route path='growers/:grower_id/orders' Component={GrowerOrders}/>
      <Route path='growers/:grower_id/products' Component={GrowerProducts}/>
      <Route path='growers/:grower_id/products/new' Component={NewProduct}/>
      <Route path='products' Component={Products}/>
      <Route path='products/:product_id' Component={Product}/>
      <Route path='products/:product_id/edit' Component={EditProduct}/>
    </Route>
  </Router>
}
