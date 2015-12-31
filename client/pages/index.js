import page from 'page'
import React from 'react'
import {render} from 'react-dom'
import json from '../json'

import App from '../views/app'
import Products from '../views/growers/products'

function data (id) {
  let el = document.getElementById(id)
  return el ? JSON.parse(el.innerHTML) : null
}

const cart = data('cart')
const user = data('user')
const market = data('market')
const content = document.getElementById('content')

const updateProduct = (product, values) => {
  return json(`/products/${product.id}`, {method: 'POST', body: values})
}

page('/growers/:id/products', (c) => {
  render(<App cart={cart} market={market} user={user} path={c.path}>
    <Products grower={data('grower')} products={data('products')} update={updateProduct}/>
  </App>, content)
})

page({click: false, popstate: false})
