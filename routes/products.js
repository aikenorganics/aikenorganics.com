'use strict'

const {Category, Product, UserGrower} = require('../db')
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
    if (!this.state.canEdit) return this.unauthorized()

    const values = this.permit(
      'active',
      'categoryId',
      'cost',
      'description',
      'name',
      'supply',
      'unit'
    )

    if (this.state.admin) Object.assign(values, this.permit('featured'))

    const {product} = this.state

    yield product.update(values)
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
