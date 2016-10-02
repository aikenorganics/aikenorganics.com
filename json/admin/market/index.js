'use strict'

const marketJson = require('../../markets/market')

exports.index = (set, {market}) => {
  set('market', market, marketJson, (set, market) => {
    set('news', market.news)
  })
}

exports.update = (set, {market}) => {
  set('market', market, marketJson, (set, market) => {
    set('news', market.news)
  })
}
