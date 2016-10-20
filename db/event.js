'use strict'

class Event extends require('ozymandias/db/instance').Model {

  static get tableName () {
    return 'events'
  }

  static get columns () {
    return [
      'id',
      'userId',
      'action',
      'target',
      'meta',
      'createdAt'
    ]
  }

  toJSON () {
    return this.slice(
      'id',
      'userId',
      'action',
      'target',
      'meta',
      'createdAt',
      'user'
    )
  }

}

module.exports = Event

const User = require('./user')

Event.belongsTo('user', {key: 'userId', model: User})
