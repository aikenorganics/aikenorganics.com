'use strict'

const {get} = require('koa-route')

module.exports = [

  // Signin
  get('/signin', function *() { this.react() }),

  // Forgot
  get('/signin/forgot', function *() { this.react() })

]
