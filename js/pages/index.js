let page = require('page')
let React = require('react')
let ReactDOM = require('react-dom')
let Supply = require('../views/growers/supply')

function data (id) {
  let el = document.getElementById(id)
  return el ? JSON.parse(el.innerHTML) : null
}

let cart = data('cart')
let user = data('user')
let market = data('market')
let content = document.getElementById('content')

page('/growers/:id/supply', (c) => {
  let props = {
    cart: cart,
    user: user,
    open: market.open,
    grower: data('grower'),
    products: data('products')
  }
  ReactDOM.render(<Supply {...props}/>, content)
})

page({click: false, popstate: false})
