'use strict'

const Model = require('./model')

class UserGrower extends Model {
  static get tableName () {
    return 'user_growers'
  }

  static get columns () {
    return [
      'id',
      'userId',
      'growerId',
      'createdAt',
      'updatedAt'
    ]
  }

  toJSON () {
    return this.slice(
      'id',
      'userId',
      'growerId',
      'user'
    )
  }
}

module.exports = UserGrower

const User = require('./user')
const Grower = require('./grower')

UserGrower.belongsTo('user', {key: 'userId', model: User})
UserGrower.belongsTo('grower', {key: 'growerId', model: Grower})
