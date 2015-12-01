'use strict'

let Model = require('./model')

class UserGrower extends Model {

  static get tableName () {
    return 'user_growers'
  }

  static get columns () {
    return [
      'id',
      'user_id',
      'grower_id',
      'created_at',
      'updated_at'
    ]
  }

}

module.exports = UserGrower
