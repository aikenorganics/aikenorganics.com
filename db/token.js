'use strict'

let Model = require('./model')

class Token extends Model {

  static get tableName () {
    return 'tokens'
  }

  static get columns () {
    return [
      'id',
      'user_id',
      'expires_at'
    ]
  }

}

module.exports = Token
