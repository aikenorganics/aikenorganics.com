'use strict'

const db = require('ozymandias/db/instance')

class Model extends db.Model {

  update (values) {
    return super.update(Object.assign({
      updatedAt: new Date()
    }, values))
  }

}

module.exports = Model
