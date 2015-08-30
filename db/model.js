'use strict'

let db = require('./db')

class Model extends db.Model {

  update (values) {
    values.updatedAt = new Date()
    return super.update(values)
  }

}

module.exports = Model
