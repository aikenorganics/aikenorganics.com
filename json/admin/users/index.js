'use strict'

const app = require('../../app')
const user = require('../../users/user')

exports.edit = (set, {_user}) => {
  set(app)
  set('user', _user)
}

exports.emails = (set, {users}) => {
  set(app)
  set('emails', users.map((user) => user.email))
}

exports.index = (set, {users}) => {
  set(app)
  set(users, 'more')
  set('users', users, user)
}

exports.new = (set) => set(app)
