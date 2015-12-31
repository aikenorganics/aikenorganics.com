'use strict'

module.exports = (req, res, next) => {
  req.state = {
    cart: req.cart.cart,
    market: req.market,
    path: req.originalUrl,
    user: req.user
  }
  next()
}
