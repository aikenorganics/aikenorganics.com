'use strict'

const app = require('../app')

exports.index = (set) => {
  set(app)
}

exports.forgot = (set) => {
  set(app)
}

exports.reset = (set, {expired, token}) => {
  set(app)
  set('expired', expired)
  if (token) {
    set('token', token.id)
    set('email', token.user.email)
  }
}
