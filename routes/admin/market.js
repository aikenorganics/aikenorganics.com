'use strict'

const {get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/market', async (_) => {
    const {market} = _.state
    _.react({
      market: Object.assign(market.toJSON(), market.slice('news'))
    })
  }),

  // Update
  post('/admin/market', async (_) => {
    const {market} = _.state
    await market.update(_.permit('message', 'news', 'open'))
    _.react({
      market: Object.assign(market.toJSON(), market.slice('news'))
    })
  })

]
