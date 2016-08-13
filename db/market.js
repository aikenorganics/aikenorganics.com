'use strict'

const marked = require('marked')
const Model = require('./model')

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

  get messageHtml () {
    return marked(this.message)
  }

}

module.exports = Market
