'use strict'

const Market = require('./db/market')

module.exports = function *(next) {
  const domain = this.app.hostname || this.hostname
  const market = yield Market.where({domain}).find()
  if (!market) return this.notfound()
  this.state.market = market
  this.state.open = market.open
  this.state.client.market = market
  yield next
}
