'use strict'

const {get, post} = require('koa-route')

const attributes = [
  'closeDay',
  'closeHours',
  'closeMinutes',
  'message',
  'news',
  'openDay',
  'openHours',
  'openMinutes'
]

module.exports = [

  // Index
  get('/admin/market', async (_) => {
    const {market} = _.state
    _.react({
      market: Object.assign(market.toJSON(), market.slice(...attributes))
    })
  }),

  // Update
  post('/admin/market', async (_) => {
    const {market} = _.state
    await market.update(_.permit(...attributes))
    _.react({
      market: Object.assign(market.toJSON(), market.slice(...attributes))
    })
  })

]
