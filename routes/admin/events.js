'use strict'

const User = require('../../db/user')
const Event = require('../../db/event')
const {get} = require('koa-route')

module.exports = [

  // Index
  get('/admin/events', async (_) => {
    const scope = Event.include('user', 'product', 'grower')

    // Paginate!
    const page = +(_.query.page || 1)

    // User?
    const {userId} = _.query
    if (userId) scope.where({userId})

    // Load 'em up.
    const [users, events] = await Promise.all([
      User.order('email').all(),
      scope.order(['createdAt', 'descending']).paginate(page, 50)
    ])

    _.react({
      events,
      more: events.more,
      page,
      userId,
      users: users.map((user) => user.slice('email', 'id'))
    })
  })

]
