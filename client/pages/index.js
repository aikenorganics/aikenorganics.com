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
const root = document.getElementById('root')

page((c, next) => {
  c.render = (view) => {
    render(<App cart={cart} market={market} user={user} path={c.path}>
      {view}
    </App>, root)
  }
  next()
})

const update = (product, values) => {
  return json(`/products/${product.id}`, {method: 'POST', body: values})
}

page('/growers/:id/products', (c) => {
  c.render(
    <Products grower={data('grower')} products={data('products')} update={update}/>
  )
})

page({click: false, popstate: false})
