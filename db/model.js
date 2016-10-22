'use strict'

const db = require('ozymandias/db/instance')
const Event = require('./event')

class Model extends db.Model {

  update (values, currentUser) {
    values.updatedAt = new Date()

    // Only log an event if a user is provided.
    if (!currentUser) return super.update(values)

    return super.update(values).then((result) => (
      Event.create({
        userId: currentUser.id,
        action: 'update',
        meta: JSON.stringify(this.slice(...Object.keys(values))),
        growerId: this.tableName === 'growers' ? this.id : null,
        productId: this.tableName === 'products' ? this.id : null
      }).then(() => result)
    ))
  }

}

module.exports = Model
