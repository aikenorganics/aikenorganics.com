import React from 'react'
import Router, {Route} from './router'

import App from './views/app'
import Admin from './views/admin/app'

import CurrentOrder from './views/orders/current'

import Cart from './views/cart/index'

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

import Categories from './views/admin/categories/index'
import EditCategory from './views/admin/categories/edit'
import NewCategory from './views/admin/categories/new'

import Locations from './views/admin/locations/index'
import EditLocation from './views/admin/locations/edit'
import NewLocation from './views/admin/locations/new'

import Emails from './views/admin/users/emails'
import Users from './views/admin/users/index'
import NewUser from './views/admin/users/new'
import EditUser from './views/admin/users/edit'

import Market from './views/admin/market/index'

import AdminProducts from './views/admin/products/index'

import AdminGrowers from './views/admin/growers/index'
import AdminGrowersShow from './views/admin/growers/show'
import AdminGrowersOrders from './views/admin/growers/orders'
import AdminGrowersUsers from './views/admin/growers/users'

import AdminOrders from './views/admin/orders/index'
import AdminOrdersShow from './views/admin/orders/show'

import Settings from './views/settings/index'

export default (state) => {
  return <Router state={state}>
    <Route path='/admin/' Component={Admin}>
      <Route path='categories' Component={Categories}/>
      <Route path='categories/:category_id/edit' Component={EditCategory}/>
      <Route path='categories/new' Component={NewCategory}/>
      <Route path='products' Component={AdminProducts}/>
      <Route path='growers' Component={AdminGrowers}/>
      <Route path='growers/orders' Component={AdminGrowersOrders}/>
      <Route path='growers/:grower_id' Component={AdminGrowersShow}/>
      <Route path='growers/:grower_id/users' Component={AdminGrowersUsers}/>
      <Route path='locations' Component={Locations}/>
      <Route path='locations/:location_id/edit' Component={EditLocation}/>
      <Route path='locations/new' Component={NewLocation}/>
      <Route path='orders' Component={AdminOrders}/>
      <Route path='orders/:order_id' Component={AdminOrdersShow}/>
      <Route path='market' Component={Market}/>
      <Route path='users' Component={Users}/>
      <Route path='users/new' Component={NewUser}/>
      <Route path='users/emails' Component={Emails}/>
      <Route path='users/:user_id/edit' Component={EditUser}/>
    </Route>
    <Route path='/' Component={App}>
      <Route path='cart' Component={Cart}/>
      <Route path='growers' Component={Growers}/>
      <Route path='growers/new' Component={NewGrower}/>
      <Route path='growers/:grower_id' Component={Grower}/>
      <Route path='growers/:grower_id/edit' Component={EditGrower}/>
      <Route path='growers/:grower_id/orders' Component={GrowerOrders}/>
      <Route path='growers/:grower_id/products' Component={GrowerProducts}/>
      <Route path='growers/:grower_id/products/new' Component={NewProduct}/>
      <Route path='orders/current' Component={CurrentOrder}/>
      <Route path='products' Component={Products}/>
      <Route path='products/:product_id' Component={Product}/>
      <Route path='products/:product_id/edit' Component={EditProduct}/>
      <Route path='settings' Component={Settings}/>
    </Route>
  </Router>
}
