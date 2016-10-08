'use strict'

const db = require('../db')
const app = require('../app')

module.exports = (request, response, next) => {
  const domain = app.get('hostname') || request.hostname
  db.Market.where({domain}).find().then((market) => {
    if (!market) return response.notfound()
    request.market = response.locals.market = market
    request.open = response.locals.open = market.open
    next()
  })
}
