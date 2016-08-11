'use strict'

const marketJson = require('../../markets/market')

exports.index = (set) => {}

exports.update = (set, {market}) => {
  set('market', market, marketJson)
}
