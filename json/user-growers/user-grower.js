'use strict'

const userJson = require('../users/user')

module.exports = (set, userGrower) => {
  set(userGrower,
    'id',
    'user_id',
    'grower_id'
  )

  if (userGrower.user) {
    set('user', userGrower.user, userJson)
  }
}
