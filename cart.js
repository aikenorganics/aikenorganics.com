'use strict'

const Cart = require('./lib/cart')

module.exports = function *(next) {
  const cart = this.state.cart = new Cart(this.session)
  this.state.client.cart = cart.cart
  yield next
}
