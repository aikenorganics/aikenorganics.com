'use strict'

const Market = require('./db/market')

module.exports = async (_, next) => {
  const market = await Market.where({domain: _.hostname}).find()
  if (!market) return _.notfound()
  _.state.market = market
  _.state.open = market.open
  _.state.client.market = market
  await next()
}
