'use strict'

const userJson = require('../users/user')

module.exports = (set, userGrower) => {
  set(userGrower,
    'id',
    'userId',
    'growerId'
  )

  if (userGrower.user) {
    set('user', userGrower.user, userJson)
  }
}
