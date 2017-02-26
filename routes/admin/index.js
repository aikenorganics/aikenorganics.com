'use strict'

const {all} = require('koa-route')

module.exports = [

  all('/admin', async (_, next) => {
    if (!_.state.admin) return _.unauthorized()
    await next()
  }, {end: false})

].concat(
  require('./users'),
  require('./events'),
  require('./orders'),
  require('./market'),
  require('./growers'),
  require('./products'),
  require('./locations'),
  require('./categories'),
  require('./user-growers'),
  require('./product-orders')
)
