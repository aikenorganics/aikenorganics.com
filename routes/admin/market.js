'use strict'

const {get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/market', async (_) => {
    const {market} = _.state
    _.react({
      market: Object.assign(market.toJSON(), market.slice(
        'news',
        'openDay',
        'openHours',
        'openMinutes',
        'closeDay',
        'closeHours',
        'closeMinutes'
      ))
    })
  }),

  // Update
  post('/admin/market', async (_) => {
    const {market} = _.state
    await market.update(_.permit(
      'message',
      'news',
      'openDay',
      'openHours',
      'openMinutes',
      'closeDay',
      'closeHours',
      'closeMinutes'
    ))
    _.react({
      market: Object.assign(market.toJSON(), market.slice(
        'news',
        'openDay',
        'openHours',
        'openMinutes',
        'closeDay',
        'closeHours',
        'closeMinutes'
      ))
    })
  })

]
