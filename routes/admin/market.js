'use strict'

const {get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/market', function *() {
    const {market} = this.state
    this.react({
      market: Object.assign(market.toJSON(), market.slice('news'))
    })
  }),

  // Update
  post('/admin/market', function *() {
    const {market} = this.state
    yield market.update(this.permit('message', 'news', 'open'))
    this.react({
      market: Object.assign(market.toJSON(), market.slice('news'))
    })
  })

]
