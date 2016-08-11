'use strict'

const userGrowerJson = require('../../user-growers/user-grower')

exports.create = (set, {userGrower}) => {
  set('userGrower', userGrower, userGrowerJson)
}
