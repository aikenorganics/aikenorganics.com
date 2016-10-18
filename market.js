'use strict'

const Market = require('./db/market')

module.exports = function *(next) {
  const market = yield Market.where({domain: this.hostname}).find()
  if (!market) return this.notfound()
  this.state.market = market
  this.state.open = market.open
  this.state.client.market = market
  yield next
}
