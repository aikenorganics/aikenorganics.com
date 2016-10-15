'use strict'

const {all} = require('koa-route')

module.exports = [

  all('/admin', function *(next) {
    if (!this.state.admin) return this.unauthorized()
    yield next
  }, {end: false})

].concat(
  require('./users'),
  require('./orders'),
  require('./market'),
  require('./growers'),
  require('./products'),
  require('./locations'),
  require('./categories'),
  require('./user-growers'),
  require('./product-orders')
)
