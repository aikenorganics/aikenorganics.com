'use strict'

module.exports = (json, category) => {
  json.pick(category,
    'id',
    'meat',
    'name',
    'position'
  )
}
