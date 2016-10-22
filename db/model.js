'use strict'

const db = require('ozymandias/db/instance')

class Model extends db.Model {

  update (values, currentUser) {
    values.updatedAt = new Date()
    return super.update(values)
  }

}

module.exports = Model
