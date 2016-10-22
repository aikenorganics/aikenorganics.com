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
      'meta',
      'createdAt',
      'growerId',
      'productId'
    ]
  }

  toJSON () {
    return this.slice(
      'id',
      'userId',
      'action',
      'meta',
      'createdAt',
      'growerId',
      'productId',
      'user',
      'product',
      'grower'
    )
  }

}

module.exports = Event

const User = require('./user')
const Grower = require('./grower')
const Product = require('./product')

Event.belongsTo('user', {key: 'userId', model: User})
Event.belongsTo('grower', {key: 'growerId', model: Grower})
Event.belongsTo('product', {key: 'productId', model: Product})
