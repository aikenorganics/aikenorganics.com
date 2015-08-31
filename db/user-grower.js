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
      {name: 'created_at', property: 'createdAt'},
      {name: 'updated_at', property: 'updatedAt'}
    ]
  }

}

module.exports = UserGrower
