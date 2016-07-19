'use strict'

exports.index = (set) => {}

exports.forgot = (set) => {}

exports.reset = (set, {expired, token}) => {
  set('expired', expired)
  if (token) {
    set('token', token.id)
    set('email', token.user.email)
  }
}
