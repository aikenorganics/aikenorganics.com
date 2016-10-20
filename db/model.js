'use strict'

const db = require('ozymandias/db/instance')
const Event = require('./event')

class Model extends db.Model {

  update (values, currentUser) {
    values.updatedAt = new Date()
    if (!currentUser) return super.update(values)
    return super.update(values).then((result) => (
      Event.create({
        userId: currentUser.id,
        action: 'update',
        target: this.tableName,
        meta: JSON.stringify(this.slice('id', ...Object.keys(values)))
      }).then(() => result)
    ))
  }

}

module.exports = Model
