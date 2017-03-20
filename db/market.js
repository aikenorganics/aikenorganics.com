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
      'closed',
      'id',
      'news',
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

  get now () {
    return this._now || (this._now = new Date())
  }

  set now (value) {
    this._now = value
  }

  get open () {
    return !this.closed && this.nextOpen >= this.nextClose
  }

  get nextClose () {
    return this.nextDate(this.closeDay, this.closeHours, this.closeMinutes)
  }

  get nextOpen () {
    return this.nextDate(this.openDay, this.openHours, this.openMinutes)
  }

  nextDate (day, hours, minutes) {
    const date = new Date(this.now)

    // Shift to local zone
    time.tzset('America/New_York')
    const {gmtOffset} = time.localtime(date / 1000)
    date.setUTCSeconds(date.getUTCSeconds() + gmtOffset)

    // Set day, hours, minutes
    date.setUTCDate(date.getUTCDate() - date.getUTCDay() + day)
    date.setUTCHours(hours)
    date.setUTCMinutes(minutes)

    // Shift back to UTC
    date.setUTCSeconds(date.getUTCSeconds() - gmtOffset)

    // Shift forward if necessary
    if (date < this.now) date.setUTCDate(date.getUTCDate() + 7)

    return date
  }

  toJSON () {
    return this.slice(
      'id',
      'domain',
      'messageHtml',
      'nextClose',
      'nextOpen',
      'open'
    )
  }
}

module.exports = Market
