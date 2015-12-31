import page from 'page'
import React from 'react'
import {render} from 'react-dom'
import json from '../json'

import App from '../views/app'
import Products from '../views/growers/products'

const root = document.getElementById('root')
const state = JSON.parse(document.getElementById('state').innerHTML)

page((c, next) => {
  c.state = state
  c.render = (view) => {
    const {cart, user, market} = c.state
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
  const {grower, products} = c.state
  c.render(
    <Products grower={grower} products={products} update={update}/>
  )
})

page({click: false, popstate: false})
