'use strict'

module.exports = (json, market) => {
  json.pick(market,
    'id',
    'domain',
    'message',
    'open'
  )
}
