'use strict'

module.exports = (json, location) => {
  json.pick(location,
    'id',
    'name',
    'active'
  )
}
