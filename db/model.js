'use strict'

const db = require('ozymandias/db/instance')

class Model extends db.Model {

  update (values) {
    values.updatedAt = new Date()
    return super.update(values)
  }

}

module.exports = Model
