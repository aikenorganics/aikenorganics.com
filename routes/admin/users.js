'use strict'

const {Order, User} = require('../../db')
const {all, del, get, post} = require('koa-route')

module.exports = [

  // Handle duplicate email errors
  all('/admin/users', async (_, next) => {
    try {
      await next()
    } catch (error) {
      if (error.constraint !== 'users_lower_case_email_index') throw error
      _.status = 422
      _.body = {email: ['A user with that email already exists.']}
    }
  }, {end: false}),

  // Index
  get('/admin/users', async (_) => {
    let scope = User

    // Search
    const {search} = _.query
    if (search) scope = scope.search(search)

    // Pagination
    const page = +(_.query.page || 1)

    const users = await scope.order('email').paginate(page, 100)

    _.render({
      more: users.more,
      page,
      search,
      users
    })
  }),

  // Emails
  get('/admin/users/emails', async (_) => {
    const users = await User.order('email').all()
    _.render({
      emails: users.map(({email}) => email)
    })
  }),

  // Order
  post('/admin/users/:id/order', async (_, id) => {
    let order = await Order.where({status: 'open', userId: id}).find()
    if (!order) order = await Order.create({userId: +id})
    _.body = {order}
  }),

  // Edit
  get('/admin/users/:id/edit', async (_, id) => {
    const user = await User.select(`exists(
      select id from orders where user_id = users.id
    ) as "hasOrder"`).find(id)
    _.render({user})
  }),

  // New
  get('/admin/users/new', async (_) => {
    _.render()
  }),

  // Create
  post('/admin/users', async (_) => {
    const user = await User.create(_.permit(
      'email', 'first', 'last', 'phone', 'memberUntil'
    ))
    _.body = {user}
  }),

  // Update
  post('/admin/users/:id', async (_, id) => {
    const user = await User.find(id)
    if (!user) return _.notfound()
    await user.update(_.permit(
      'email', 'first', 'last', 'phone', 'isAdmin', 'memberUntil'
    ))
    _.body = {user}
  }),

  // Image
  post('/admin/users/:id/image', async (_, id) => {
    const user = await User.find(id)
    if (!user) return _.notfound()
    await user.uploadImage(_.req)
    _.body = {user}
  }),

  // Delete
  del('/admin/users/:id', async (_, id) => {
    const user = await User.find(id)
    if (!user) return _.notfound()
    await user.destroy()
    _.body = {}
  })

]
