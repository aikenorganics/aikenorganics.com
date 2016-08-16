'use strict'

const userJson = require('../../users/user')

exports.create = (set, {user}) => {
  set('user', user, userJson)
}

exports.edit = (set, {user}) => {
  set('user', user, userJson)
}

exports.emails = (set, {users}) => {
  set('emails', users.map(({email}) => email))
}

exports.image = (set, {user}) => {
  set('user', user, userJson)
}

exports.index = (set, {page, search, users}) => {
  set({page, search})
  set(users, 'more')
  set('users', users, userJson)
}

exports.new = (set) => {}

exports.update = (set, {user}) => {
  set('user', user, userJson)
}
