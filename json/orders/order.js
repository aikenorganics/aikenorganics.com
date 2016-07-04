'use strict'

const userJson = require('../users/user')
const locationJson = require('../locations/location')

module.exports = (set, order) => {
  set(order,
    'id',
    'location_id',
    'notes',
    'status',
    'user_id',
    'total'
  )

  if (order.user) {
    set('user', order.user, userJson)
  }

  if (order.location) {
    set('location', order.location, locationJson)
  }
}
