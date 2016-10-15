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

  toJSON () {
    return this.slice(
      'id',
      'domain',
      'message',
      'messageHtml',
      'open'
    )
  }

}

module.exports = Market
