'use strict'

const locationJson = require('../../locations/location')

exports.index = (set, {locations}) => {
  set('locations', locations, locationJson)
}

exports.new = (set) => {}

exports.edit = (set, {location}) => {
  set('location', location, locationJson)
}
