'use strict'

const {Category, Grower, Product, UserGrower} = require('../db')
const {all, get, post} = require('koa-route')

module.exports = [

  // New Grower
  get('/growers/new', function *() {
    if (!this.state.admin) return this.unauthorized()
    this.react()
  }),

  // Find Grower
  all('/growers/:id', function *(id, next) {
    this.state.grower = yield Grower.find(id)
    if (!this.state.grower) return this.notfound()
    yield next
  }, {end: false}),

  // Authorize
  all('/growers/:id', function *(id, next) {
    const {currentUser, grower} = this.state
    this.state.canEdit = this.state.client.canEdit =
    currentUser && grower && (this.state.admin || !!(yield UserGrower.where({
      userId: currentUser.id,
      growerId: grower.id
    }).find()))
    yield next
  }, {end: false}),

  // Index
  get('/growers', function *() {
    const growers = yield Grower.where({active: true}).order('name').all()
    this.react({growers})
  }),

  // Create
  post('/growers', function *() {
    if (!this.state.admin) return this.unauthorized()

    const grower = yield Grower.create(this.permit(
      'url', 'name', 'email', 'location', 'description'
    ))

    this.body = {
      grower: Object.assign(grower.toJSON(), {
        description: grower.description
      })
    }
  }),

  // Show
  get('/growers/:id', function *(id) {
    const scope = Product.where({growerId: id})

    if (!this.state.canEdit) scope.where({active: true})

    const {grower} = this.state
    const products = yield scope.order('name').all()

    this.react({
      grower: Object.assign(grower.toJSON(), {
        descriptionHtml: grower.descriptionHtml
      }),
      products
    })
  }),

  // Edit Grower
  get('/growers/:id/edit', function *() {
    if (!this.state.canEdit) return this.unauthorized()
    const {grower} = this.state
    this.react({
      grower: Object.assign(grower.toJSON(), {
        description: grower.description
      })
    })
  }),

  // Update
  post('/growers/:id', function *() {
    if (!this.state.canEdit) return this.unauthorized()

    const {currentUser, grower} = this.state
    yield grower.update(this.permit(
      'active', 'name', 'email', 'url', 'location', 'description'
    ), currentUser)
    this.body = {grower}
  }),

  // New Product
  get('/growers/:id/products/new', function *() {
    if (!this.state.canEdit) return this.unauthorized()
    const {grower} = this.state
    const categories = yield Category.all()
    this.react({categories, grower})
  }),

  // Create Product
  post('/growers/:id/products', function *() {
    if (!this.state.canEdit) return this.unauthorized()

    const {grower} = this.state
    const values = this.permit(
      'name',
      'cost',
      'unit',
      'supply',
      'categoryId',
      'description'
    )

    // Set the grower id.
    values.growerId = grower.id

    // Admins can set featured.
    if (this.state.admin) {
      Object.assign(values, this.permit('featured'))
    }

    const product = yield Product.create(values)
    this.body = {product}
  }),

  // Orders
  get('/growers/:id/orders', function *() {
    if (!this.state.canEdit) return this.unauthorized()

    const {grower} = this.state
    const products = yield Product
      .where({growerId: grower.id}).where('reserved > 0').all()

    this.react({grower, products})
  }),

  // Products
  get('/growers/:id/products', function *() {
    if (!this.state.canEdit) return this.unauthorized()

    const {grower} = this.state
    const products = yield Product.where({growerId: grower.id}).order('name').all()

    this.react({grower, products})
  }),

  // Image
  post('/growers/:id/image', function *() {
    if (!this.state.canEdit) return this.unauthorized()

    const {grower} = this.state
    yield grower.uploadImage(this.req)
    this.body = {grower}
  })

]
