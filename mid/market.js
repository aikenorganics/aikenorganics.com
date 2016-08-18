'use strict'

const db = require('../db')
const app = require('../app')

module.exports = (req, res, next) => {
  const domain = app.get('hostname') || req.hostname
  db.Market.where({domain}).find().then((market) => {
    if (!market) return res.notfound()
    req.market = res.locals.market = market
    req.open = res.locals.open = market.open
    next()
  })
}
