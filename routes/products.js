'use strict'

const Category = require('../db/category')
const Event = require('../db/event')
const Product = require('../db/product')
const UserGrower = require('../db/user-grower')
const {all, get, post} = require('koa-route')

module.exports = [

  // Find Product
  all('/products/:id', function *(id, next) {
    this.state.product = yield Product.include('grower', 'category').find(id)
    if (!this.state.product) return this.notfound()
    yield next
  }, {end: false}),

  // Authorize
  all('/products/:id', function *(id, next) {
    const {currentUser, product} = this.state
    this.state.canEdit = this.state.client.canEdit =
    currentUser && product && (this.state.admin || !!(yield UserGrower.where({
      userId: currentUser.id,
      growerId: product.growerId
    }).find()))
    yield next
  }, {end: false}),

  // Index
  get('/products', function *() {
    const scope = Product
      .include('grower').join('grower')
      .where({active: true, grower: {active: true}})

    // Search
    const {search} = this.query
    if (search) scope.search(search)

    // Category
    const {categoryId} = this.query
    if (categoryId) scope.where({categoryId})

    // Grower
    const {growerId} = this.query
    if (growerId) scope.where({growerId})

    // Pagination
    const page = +(this.query.page || 1)

    const [products, categories] = yield Promise.all([
      scope.order('name').paginate(page, 30),
      Category.where(`exists(
        select 1 from products
        inner join growers on growers.id = products.grower_id
        where category_id = categories.id and products.active and growers.active
      )`).order('position').all()
    ])

    this.react({
      categories,
      categoryId,
      more: products.more,
      page,
      products,
      search
    })
  }),

  // Show
  get('/products/:id', function *() {
    const product = this.state.product.toJSON()

    product.descriptionHtml = this.state.product.descriptionHtml
    this.react({product})
  }),

  // Edit
  get('/products/:id/edit', function *() {
    if (!this.state.canEdit) return this.unauthorized()

    const {product} = this.state
    const categories = yield Category.order('position').all()

    this.react({
      categories,
      product: Object.assign(product.toJSON(), {
        description: product.description
      })
    })
  }),

  // Update
  post('/products/:id', function *() {
    const {admin, canEdit, currentUser, product} = this.state

    if (!canEdit) return this.unauthorized()

    const values = this.permit(
      'active',
      'categoryId',
      'cost',
      'description',
      'name',
      'supply',
      'unit'
    )

    if (admin) Object.assign(values, this.permit('featured'))

    yield product.update(values)
    yield Event.create({
      action: 'update',
      userId: currentUser.id,
      productId: product.id,
      meta: JSON.stringify(values)
    })

    this.body = {
      product: Object.assign(product.toJSON(), {
        description: product.description
      })
    }
  }),

  // Image
  post('/products/:id/image', function *() {
    if (!this.state.canEdit) return this.unauthorized()

    const {product} = this.state
    yield product.uploadImage(this.req)
    this.body = {product}
  })

]
