'use strict'

const userJson = require('../users/user')
const locationJson = require('../locations/location')

module.exports = (set, order) => {
  set(order,
    'id',
    'locationId',
    'notes',
    'status',
    'userId',
    'total'
  )

  if (order.user) {
    set('user', order.user, userJson)
  }

  if (order.location) {
    set('location', order.location, locationJson)
  }
}
