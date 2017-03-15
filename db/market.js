'use strict'

const time = require('time')
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
      'openDay',
      'openHours',
      'openMinutes',
      'closeDay',
      'closeHours',
      'closeMinutes',
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

  isOpenAt (date) {
    time.tzset('America/New_York')
    const {gmtOffset} = time.localtime(date / 1000)

    const now = new Date(date)
    now.setUTCSeconds(now.getUTCSeconds() + gmtOffset)

    const open = new Date(now)
    open.setUTCDate(open.getUTCDate() - now.getUTCDay() + this.openDay)
    open.setUTCHours(this.openHours)
    open.setUTCMinutes(this.openMinutes)

    const close = new Date(now)
    close.setUTCDate(close.getUTCDate() - now.getUTCDay() + this.closeDay)
    close.setUTCHours(this.closeHours)
    close.setUTCMinutes(this.closeMinutes)

    return (open <= now && now <= close) || (close <= open && (now <= close || open <= now))
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
