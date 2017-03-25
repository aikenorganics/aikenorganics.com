'use strict'

const Category = require('../db/category')
const Event = require('../db/event')
const Product = require('../db/product')
const UserGrower = require('../db/user-grower')
const {all, get, post} = require('koa-route')

module.exports = [

  // Find Product
  all('/products/:id', async (_, id, next) => {
    _.state.product = await Product.include('grower', 'category').find(id)
    if (!_.state.product) return _.notfound()
    await next()
  }, {end: false}),

  // Authorize
  all('/products/:id', async (_, id, next) => {
    const {currentUser, product} = _.state
    _.state.canEdit = _.state.client.canEdit =
    currentUser && product && (_.state.admin || !!(await UserGrower.where({
      userId: currentUser.id,
      growerId: product.growerId
    }).find()))
    await next()
  }, {end: false}),

  // Index
  get('/products', async (_) => {
    const scope = Product
      .include('grower').join('grower')
      .where({active: true, grower: {active: true}})

    // Search
    const {search} = _.query
    if (search) scope.search(search)

    // Category
    const {categoryId} = _.query
    if (Number.isFinite(+categoryId)) scope.where({categoryId})

    // Grower
    const {growerId} = _.query
    if (Number.isFinite(+growerId)) scope.where({growerId})

    // Pagination
    let page = +(_.query.page || 1)
    if (!Number.isFinite(page)) page = 1

    const [products, categories] = await Promise.all([
      scope.order('name').paginate(page, 30),
      Category.where(`exists(
        select 1 from products
        inner join growers on growers.id = products.grower_id
        where category_id = categories.id and products.active and growers.active
      )`).order('position').all()
    ])

    _.react({
      categories,
      categoryId,
      more: products.more,
      page,
      products,
      search
    })
  }),

  // Show
  get('/products/:id', async (_) => {
    const product = _.state.product.toJSON()

    product.descriptionHtml = _.state.product.descriptionHtml
    _.react({product})
  }),

  // Edit
  get('/products/:id/edit', async (_) => {
    if (!_.state.canEdit) return _.unauthorized()

    const {product} = _.state
    const categories = await Category.order('position').all()

    _.react({
      categories,
      product: Object.assign(product.toJSON(), {
        description: product.description
      })
    })
  }),

  // Update
  post('/products/:id', async (_) => {
    const {admin, canEdit, currentUser, product} = _.state

    if (!canEdit) return _.unauthorized()

    const values = _.permit(
      'active',
      'categoryId',
      'cost',
      'description',
      'name',
      'supply',
      'unit'
    )

    if (admin) Object.assign(values, _.permit('featured'))

    await product.update(values)
    await Event.create({
      action: 'update',
      userId: currentUser.id,
      productId: product.id,
      meta: JSON.stringify(values)
    })

    _.body = {
      product: Object.assign(product.toJSON(), {
        description: product.description
      })
    }
  }),

  // Image
  post('/products/:id/image', async (_) => {
    if (!_.state.canEdit) return _.unauthorized()

    const {product} = _.state
    await product.uploadImage(_.req)
    _.body = {product}
  })

]
