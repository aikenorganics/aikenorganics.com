'use strict'

const User = require('../../db/user')
const Event = require('../../db/event')
const {get} = require('koa-route')

module.exports = [

  // Index
  get('/admin/events', function *() {
    const scope = Event.include('user', 'product', 'grower')

    // Paginate!
    const page = +(this.query.page || 1)

    // User?
    const {userId} = this.query
    if (userId) scope.where({userId})

    // Load 'em up.
    const [users, events] = yield Promise.all([
      User.order('email').all(),
      scope.order(['createdAt', 'descending']).paginate(page, 50)
    ])

    this.react({
      events,
      more: events.more,
      page,
      userId,
      users: users.map((user) => user.slice('email', 'id'))
    })
  })

]
