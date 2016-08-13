'use strict'

const userJson = require('../users/user')

exports.card = (set, {user}) => {
  set('user', user, userJson)
}

exports.index = (set) => {}

exports.update = (set, {user}) => {
  set('user', user, userJson)
}
