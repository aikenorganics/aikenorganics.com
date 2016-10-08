'use strict'

const Cart = require('../lib/cart')

module.exports = (request, response, next) => {
  request.cart = response.locals.cart = new Cart(request.session)
  next()
}
