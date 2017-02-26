'use strict'

const Cart = require('./lib/cart')

module.exports = async (_, next) => {
  const cart = _.state.cart = new Cart(_.session)
  _.state.client.cart = cart.cart
  await next()
}
