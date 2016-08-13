'use strict'

const userJson = require('../../users/user')

exports.create = (set, {_user}) => {
  set('user', _user, userJson)
}

exports.edit = (set, {_user}) => {
  set('user', _user, userJson)
}

exports.emails = (set, {users}) => {
  set('emails', users.map(({email}) => email))
}

exports.image = (set, {_user}) => {
  set('user', _user, userJson)
}

exports.index = (set, {page, search, users}) => {
  set({page, search})
  set(users, 'more')
  set('users', users, userJson)
}

exports.new = (set) => {}

exports.update = (set, {_user}) => {
  set('user', _user, userJson)
}
