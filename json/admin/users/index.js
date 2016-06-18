'use strict'

const app = require('../../app')
const user = require('../../users/user')

exports.edit = (json, locals) => {
  app(json, locals)
  json.set('user', locals._user)
}

exports.emails = (json, locals) => {
  app(json, locals)
  json.set('emails', locals.users.map((user) => user.email))
}

exports.index = (json, locals) => {
  app(json, locals)
  json.set('more', locals.users.more)
  json.set('users', locals.users, user)
}

exports.new = (json, locals) => {
  app(json, locals)
}
