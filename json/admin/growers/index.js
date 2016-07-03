'use strict'

const app = require('../../app')
const growerJson = require('../../growers/grower')

exports.index = (set, {growers}) => {
  set(app)
  set('growers', growers, growerJson, (set, grower) => {
    set(grower, 'total')
  })
}
