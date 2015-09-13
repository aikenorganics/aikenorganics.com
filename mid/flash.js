'use strict'

module.exports = function (req, res, next) {
  res.flash = function (type, message) {
    let flash = req.session.flash = {}
    flash[type] = message
  }
  req.flash = res.locals.flash = req.session.flash
  delete req.session.flash
  next()
}
