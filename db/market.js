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
      'news',
      'open',
      'domain',
      'message',
      'createdAt',
      'updatedAt'
    ]
  }

  get messageHtml () {
    return marked(this.message)
  }

  get newsHtml () {
    return marked(this.news)
  }

}

module.exports = Market
