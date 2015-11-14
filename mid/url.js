'use strict'

const qs = require('qs')

module.exports = function (req, res, next) {
  req.urlWith = res.locals.urlWith = function (values) {
    let query = qs.stringify(Object.assign({}, req.query, values))
    return `${req.baseUrl}${req.path}?${query}`
  }
  next()
}
