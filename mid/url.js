'use strict'

let qs = require('qs')

module.exports = function (req, res, next) {
  req.urlWith = res.locals.urlWith = function (values) {
    let query = {}
    for (let key in req.query) query[key] = req.query[key]
    for (let key in values) query[key] = values[key]
    return `${req.baseUrl}${req.path}?${qs.stringify(query)}`
  }
  next()
}
