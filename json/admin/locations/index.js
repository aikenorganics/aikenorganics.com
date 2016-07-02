'use strict'

const app = require('../../app')
const locationJson = require('../../locations/location')

exports.index = (set, {locations}) => {
  set(app)
  set('locations', locations, locationJson)
}

exports.new = (set) => set(app)

exports.edit = (set, {location}) => {
  set(app)
  set('location', location, locationJson)
}
