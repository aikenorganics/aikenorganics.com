'use strict'

let Model = require('./model')

class Market extends Model {

  static get tableName () {
    return 'markets'
  }

  static get columns () {
    return [
      'id',
      'open',
      'domain',
      'message',
      'created_at',
      'updated_at'
    ]
  }

  toJSON () {
    return {
      id: this.id,
      open: this.open,
      domain: this.domain,
      message: this.message
    }
  }
}

module.exports = Market
