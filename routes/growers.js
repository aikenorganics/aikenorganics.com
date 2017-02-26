'use strict'

const Event = require('../db/event')
const Grower = require('../db/grower')
const Product = require('../db/product')
const Category = require('../db/category')
const UserGrower = require('../db/user-grower')
const {all, get, post} = require('koa-route')

module.exports = [

  // New Grower
  get('/growers/new', async (_) => {
    if (!_.state.admin) return _.unauthorized()
    _.react()
  }),

  // Find Grower
  all('/growers/:id', async (_, id, next) => {
    _.state.grower = await Grower.find(id)
    if (!_.state.grower) return _.notfound()
    await next()
  }, {end: false}),

  // Authorize
  all('/growers/:id', async (_, id, next) => {
    const {currentUser, grower} = _.state
    _.state.canEdit = _.state.client.canEdit =
    currentUser && grower && (_.state.admin || !!(await UserGrower.where({
      userId: currentUser.id,
      growerId: grower.id
    }).find()))
    await next()
  }, {end: false}),

  // Index
  get('/growers', async (_) => {
    const growers = await Grower.where({active: true}).order('name').all()
    _.react({growers})
  }),

  // Create
  post('/growers', async (_) => {
    if (!_.state.admin) return _.unauthorized()

    const grower = await Grower.create(_.permit(
      'url', 'name', 'email', 'location', 'description'
    ))

    _.body = {
      grower: Object.assign(grower.toJSON(), {
        description: grower.description
      })
    }
  }),

  // Show
  get('/growers/:id', async (_, id) => {
    const scope = Product.where({growerId: id})

    if (!_.state.canEdit) scope.where({active: true})

    const {grower} = _.state
    const products = await scope.order('name').all()

    _.react({
      grower: Object.assign(grower.toJSON(), {
        descriptionHtml: grower.descriptionHtml
      }),
      products
    })
  }),

  // Edit Grower
  get('/growers/:id/edit', async (_) => {
    if (!_.state.canEdit) return _.unauthorized()
    const {grower} = _.state
    _.react({
      grower: Object.assign(grower.toJSON(), {
        description: grower.description
      })
    })
  }),

  // Update
  post('/growers/:id', async (_) => {
    const {canEdit, currentUser, grower} = _.state

    if (!canEdit) return _.unauthorized()

    const values = _.permit(
      'active', 'name', 'email', 'url', 'location', 'description'
    )

    await grower.update(values)
    await Event.create({
      action: 'update',
      userId: currentUser.id,
      growerId: grower.id,
      meta: JSON.stringify(values)
    })

    _.body = {grower}
  }),

  // New Product
  get('/growers/:id/products/new', async (_) => {
    if (!_.state.canEdit) return _.unauthorized()
    const {grower} = _.state
    const categories = await Category.all()
    _.react({categories, grower})
  }),

  // Create Product
  post('/growers/:id/products', async (_) => {
    if (!_.state.canEdit) return _.unauthorized()

    const {grower} = _.state
    const values = _.permit(
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
    if (_.state.admin) {
      Object.assign(values, _.permit('featured'))
    }

    const product = await Product.create(values)
    _.body = {product}
  }),

  // Orders
  get('/growers/:id/orders', async (_) => {
    if (!_.state.canEdit) return _.unauthorized()

    const {grower} = _.state
    const products = await Product
      .where({growerId: grower.id}).where('reserved > 0').all()

    _.react({grower, products})
  }),

  // Products
  get('/growers/:id/products', async (_) => {
    if (!_.state.canEdit) return _.unauthorized()

    const {grower} = _.state
    const products = await Product.where({growerId: grower.id}).order('name').all()

    _.react({grower, products})
  }),

  // Image
  post('/growers/:id/image', async (_) => {
    if (!_.state.canEdit) return _.unauthorized()

    const {grower} = _.state
    await grower.uploadImage(_.req)
    _.body = {grower}
  })

]
