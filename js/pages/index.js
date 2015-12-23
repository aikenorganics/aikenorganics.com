import page from 'page'
import React from 'react'
import {render} from 'react-dom'

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

page('/growers/:id/products', (c) => {
  render(<App cart={cart} market={market} user={user}>
    <Products grower={data('grower')} products={data('products')}/>
  </App>, content)
})

page({click: false, popstate: false})
