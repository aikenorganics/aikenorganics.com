'use strict'

let Cart = require('../lib/cart')

module.exports = function (req, res, next) {
  req.cart = res.locals.cart = new Cart(req.session)
  next()
}
