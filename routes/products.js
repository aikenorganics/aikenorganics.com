'use strict'

const db = require('../db')
const json = require('../json/products')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('product', () => db.Product.include('grower', 'category'))

// Authorize
router.param('productId', (request, response, next) => {
  if (!request.currentUser || !request.product) return next()
  db.UserGrower.where({
    userId: request.currentUser.id,
    growerId: request.product.growerId
  }).find().then((userGrower) => {
    request.canEdit = response.locals.canEdit = request.admin || !!userGrower
    next()
  }).catch(response.error)
})

// Index
router.get('/', (request, response) => {
  let products = db.Product
    .include('grower').join('grower')
    .where({active: true, grower: {active: true}})

  // Search
  const {search} = request.query
  if (search) products.search(search)

  // Category
  const {categoryId} = request.query
  if (categoryId) products = products.where({categoryId})

  // Grower
  if (request.query.growerId) {
    products = products.where({growerId: request.query.growerId})
  }

  // Pagination
  const page = response.locals.page = +(request.query.page || 1)

  Promise.all([
    products.order('name').paginate(page, 30),
    db.Category.where(`exists(
      select 1 from products
      inner join growers on growers.id = products.grower_id
      where category_id = categories.id and products.active and growers.active
    )`).order('position').all()
  ]).then(([products, categories]) => {
    response.react(json.index, {categories, categoryId, page, products, search})
  }).catch(response.error)
})

// Show
router.get('/:productId', (request, response) => {
  response.react(json.show, {product: request.product})
})

// Edit
router.get('/:productId/edit', (request, response) => {
  if (!request.canEdit) return response.unauthorized()

  db.Category.order('position').all().then((categories) => {
    response.react(json.edit, {categories, product: request.product})
  }).catch(response.error)
})

// Update
router.post('/:productId', (request, response) => {
  if (!request.canEdit) return response.unauthorized()

  const values = request.permit(
    'active',
    'categoryId',
    'cost',
    'description',
    'name',
    'supply',
    'unit'
  )

  if (request.admin) {
    Object.assign(values, request.permit('featured'))
  }

  request.product.update(values).then(() => {
    response.json(json.update)
  }).catch(response.error)
})

// Image
router.post('/:productId/image', (request, response) => {
  if (!request.canEdit) return response.unauthorized()
  request.product.uploadImage(request).then(() => {
    response.json(json.image)
  }).catch(response.error)
})
