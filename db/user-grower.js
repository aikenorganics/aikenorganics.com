'use strict'

let Model = require('./model')

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

}

module.exports = UserGrower
