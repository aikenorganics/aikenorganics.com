'use strict'

const User = require('../db/user')
const {get, post} = require('koa-route')

module.exports = [

  get('/signup', function *() { this.react() }),

  post('/signup', function *() {
    const {email} = this.request.body
    let user = yield User.where('trim(lower(email)) = trim(lower(?))', email).find()

    if (user) {
      this.status = 422
      this.body = {email: ['That user already exists! Is it you?']}
      return
    }

    user = yield User.create(this.permit(
      'first', 'last', 'phone', 'password', 'email'
    ))

    this.signIn(user)
    this.body = {}
  })

]
