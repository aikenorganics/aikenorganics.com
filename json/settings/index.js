'use strict'

const userJson = require('../users/user')

exports.card = (set, {currentUser}) => {
  set('user', currentUser, userJson)
}

exports.index = (set) => {}

exports.update = (set, {currentUser}) => {
  set('user', currentUser, userJson)
}
