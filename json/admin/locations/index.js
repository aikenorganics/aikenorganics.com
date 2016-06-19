'use strict'

const app = require('../../app')
const location = require('../../locations/location')

exports.index = (json, locals) => {
  app(json, locals)
  json.set('locations', locals.locations, location)
}

exports.new = (json, locals) => {
  app(json, locals)
}

exports.edit = (json, locals) => {
  app(json, locals)
  json.set('location', locals.location, location)
}
