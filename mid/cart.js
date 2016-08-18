'use strict'

const Cart = require('../lib/cart')

module.exports = (req, res, next) => {
  req.cart = res.locals.cart = new Cart(req.session)
  next()
}
