'use strict'

const Event = require('../../db/event')
const {get} = require('koa-route')

module.exports = [

  // Index
  get('/admin/events', function *() {
    const page = +(this.query.page || 1)
    const events = yield Event
      .include('user')
      .order(['createdAt', 'descending'])
      .paginate(page, 50)
    this.react({events, more: events.more, page})
  })

]
