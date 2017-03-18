'use strict'

const time = require('time')
const marked = require('marked')
const Model = require('./model')

const localDate = (date) => {
  date = new Date(date)
  time.tzset('America/New_York')
  date.setUTCSeconds(date.getUTCSeconds() + time.localtime(date / 1000).gmtOffset)
  return date
}

class Market extends Model {
  static get tableName () {
    return 'markets'
  }

  static get columns () {
    return [
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

  get open () {
    return this.isOpenAt(new Date())
  }

  isOpenAt (date) {
    return this.nextOpen(date) >= this.nextClose(date)
  }

  nextClose (date) {
    const now = localDate(date)
    const close = new Date(now)
    close.setUTCDate(close.getUTCDate() - now.getUTCDay() + this.closeDay)
    close.setUTCHours(this.closeHours)
    close.setUTCMinutes(this.closeMinutes)
    if (close < now) close.setUTCDate(close.getUTCDate() + 7)
    return close
  }

  nextOpen (date) {
    const now = localDate(date)
    const open = new Date(now)
    open.setUTCDate(open.getUTCDate() - now.getUTCDay() + this.openDay)
    open.setUTCHours(this.openHours)
    open.setUTCMinutes(this.openMinutes)
    if (open < now) open.setUTCDate(open.getUTCDate() + 7)
    return open
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
