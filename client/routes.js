import React from 'react'
import Router, {Route} from './router'

import App from './views/app'
import SubNav from './views/sub-nav'
import AdminNav from './views/admin/nav'

import Market from './views/market/index'

import OrdersNav from './views/orders/nav'
import CurrentOrder from './views/orders/current'
import PreviousOrders from './views/orders/previous'

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

import AdminMarket from './views/admin/market/index'

import AdminProducts from './views/admin/products/index'

import AdminGrowers from './views/admin/growers/index'
import AdminGrowersShow from './views/admin/growers/show'
import AdminGrowersOrders from './views/admin/growers/orders'
import AdminGrowersUsers from './views/admin/growers/users'

import AdminOrders from './views/admin/orders/index'
import AdminOrdersShow from './views/admin/orders/show'

import Reset from './views/session/reset'
import Signin from './views/signin/index'
import Forgot from './views/signin/forgot'

import Signup from './views/signup/index'
import Settings from './views/settings/index'

import Index from './views/index'
import Learn from './views/learn/index'

export default (state) => {
  return <Router state={state}>
    <Route path='' Component={App}>
      <Route path='/' Component={Index} />
      <Route path='/learn' Component={Learn} />
      <Route path='/signin' Component={Signin} />
      <Route path='/signin/forgot' Component={Forgot} />
      <Route path='/session/reset/:tokenId' Component={Reset} />
      <Route path='/signup' Component={Signup} />
      <Route path='/admin/' Component={AdminNav}>
        <Route path='categories' Component={Categories} />
        <Route path='categories/:categoryId/edit' Component={EditCategory} />
        <Route path='categories/new' Component={NewCategory} />
        <Route path='products' Component={AdminProducts} />
        <Route path='growers' Component={AdminGrowers} />
        <Route path='growers/orders' Component={AdminGrowersOrders} />
        <Route path='growers/:growerId' Component={AdminGrowersShow} />
        <Route path='growers/:growerId/users' Component={AdminGrowersUsers} />
        <Route path='locations' Component={Locations} />
        <Route path='locations/:locationId/edit' Component={EditLocation} />
        <Route path='locations/new' Component={NewLocation} />
        <Route path='orders' Component={AdminOrders} />
        <Route path='orders/:orderId' Component={AdminOrdersShow} />
        <Route path='market' Component={AdminMarket} />
        <Route path='users' Component={Users} />
        <Route path='users/new' Component={NewUser} />
        <Route path='users/emails' Component={Emails} />
        <Route path='users/:userId/edit' Component={EditUser} />
      </Route>
      <Route path='/' Component={SubNav}>
        <Route path='cart' Component={Cart} />
        <Route path='market' Component={Market} />
        <Route path='growers' Component={Growers} />
        <Route path='growers/new' Component={NewGrower} />
        <Route path='growers/:growerId' Component={Grower} />
        <Route path='growers/:growerId/edit' Component={EditGrower} />
        <Route path='growers/:growerId/orders' Component={GrowerOrders} />
        <Route path='growers/:growerId/products' Component={GrowerProducts} />
        <Route path='growers/:growerId/products/new' Component={NewProduct} />
        <Route path='orders' Component={OrdersNav}>
          <Route path='/current' Component={CurrentOrder} />
          <Route path='/previous' Component={PreviousOrders} />
        </Route>
        <Route path='products' Component={Products} />
        <Route path='products/:productId' Component={Product} />
        <Route path='products/:productId/edit' Component={EditProduct} />
        <Route path='settings' Component={Settings} />
      </Route>
    </Route>
  </Router>
}
