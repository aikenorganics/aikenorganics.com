'use strict'

const {User} = require('../../db')
const {del, get, post} = require('koa-route')

module.exports = [

  // Index
  get('/admin/users', function *() {
    let scope = User

    // Search
    const {search} = this.query
    if (search) scope = scope.search(search)

    // Pagination
    const page = +(this.query.page || 1)

    const users = yield scope.order('email').paginate(page, 100)

    this.react({
      more: users.more,
      page,
      search,
      users
    })
  }),

  // Emails
  get('/admin/users/emails', function *() {
    const users = yield User.order('email').all()
    this.react({
      emails: users.map(({email}) => email)
    })
  }),

  // Edit
  get('/admin/users/:id/edit', function *(id) {
    const user = yield User.select(`exists(
      select id from orders where user_id = users.id
    ) as "hasOrder"`).find(id)
    this.react({user})
  }),

  // New
  get('/admin/users/new', function *() {
    this.react()
  }),

  // Create
  post('/admin/users', function *() {
    const user = yield User.create(this.permit(
      'email', 'first', 'last', 'phone', 'memberUntil'
    ))
    this.body = {user}
  }),

  // Update
  post('/admin/users/:id', function *(id) {
    const user = yield User.find(id)
    if (!user) return this.notfound()
    yield user.update(this.permit(
      'email', 'first', 'last', 'phone', 'isAdmin', 'memberUntil'
    ))
    this.body = {user}
  }),

  // Image
  post('/admin/users/:id/image', function *(id) {
    const user = yield User.find(id)
    if (!user) return this.notfound()
    yield user.uploadImage(this.req)
    this.body = {user}
  }),

  // Delete
  del('/admin/users/:id', function *(id) {
    const user = yield User.find(id)
    if (!user) return this.notfound()
    yield user.destroy()
    this.body = {}
  })

]
