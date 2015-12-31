'use strict'

module.exports = (req, res, next) => {
  req.state = {
    cart: req.cart,
    user: req.user,
    market: req.market
  }
  next()
}
