'use strict'

let db = require('../db')
let app = require('../app')

module.exports = function (req, res, next) {
  let domain = app.get('hostname') || req.hostname
  db.Market.where({domain: domain}).find().then(function (market) {
    if (!market) return res.notfound()
    req.market = res.locals.market = market
    req.open = res.locals.open = market.open
    next()
  })
}
