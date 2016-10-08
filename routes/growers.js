'use strict'

const db = require('../db')
const json = require('../json/growers')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('grower', () => db.Grower)

// Authorize
router.param('growerId', (request, response, next) => {
  if (!request.currentUser || !request.grower) return next()
  db.UserGrower.where({
    userId: request.currentUser.id,
    growerId: request.grower.id
  }).find().then((userGrower) => {
    request.canEdit = response.locals.canEdit = request.admin || !!userGrower
    next()
  }).catch(response.error)
})

// Index
router.get('/', (request, response) => {
  db.Grower.where({active: true}).order('name').all().then((growers) => {
    response.react(json.index, {growers})
  })
})

// New Grower
router.get('/new', (request, response) => {
  if (!request.admin) return response.unauthorized()
  response.react(json.new)
})

router.post('/', (request, response) => {
  if (!request.admin) return response.unauthorized()

  db.Grower.create(request.permit(
    'url', 'name', 'email', 'location', 'description'
  )).then((grower) => {
    response.json(json.create, {grower})
  }).catch(response.error)
})

// Show
router.get('/:growerId', (request, response) => {
  const products = db.Product.where({growerId: request.grower.id})
  if (!request.canEdit) products.where({active: true})

  products.order('name').all().then((products) => {
    response.react(json.show, {grower: request.grower, products})
  }).catch(response.error)
})

// Edit Grower
router.get('/:growerId/edit', (request, response) => {
  if (!request.canEdit) return response.unauthorized()
  response.react(json.edit, {grower: request.grower})
})

router.post('/:growerId', (request, response) => {
  if (!request.canEdit) return response.unauthorized()

  request.grower.update(request.permit(
    'active', 'name', 'email', 'url', 'location', 'description'
  )).then(() => {
    response.json({})
  }).catch(response.error)
})

// New Product
router.get('/:growerId/products/new', (request, response) => {
  if (!request.canEdit) return response.unauthorized()
  db.Category.all().then((categories) => {
    response.react(json.newProduct, {grower: request.grower, categories})
  }).catch(response.error)
})

// Create Product
router.post('/:growerId/products', (request, response) => {
  if (!request.canEdit) return response.unauthorized()

  const values = request.permit(
    'name',
    'cost',
    'unit',
    'supply',
    'categoryId',
    'description'
  )

  // Set the grower id.
  values.growerId = request.grower.id

  // Admins can set featured.
  if (request.admin) {
    Object.assign(values, request.permit('featured'))
  }

  db.Product.create(values).then((product) => {
    response.json(json.createProduct, {product})
  }).catch(response.error)
})

// Orders
router.get('/:growerId/orders', (request, response) => {
  if (!request.canEdit) return response.unauthorized()

  db.Product
  .where({growerId: request.grower.id})
  .where('reserved > 0')
  .all().then((products) => {
    response.react(json.orders, {grower: request.grower, products})
  }).catch(response.error)
})

// Products
router.get('/:growerId/products', (request, response) => {
  if (!request.canEdit) return response.unauthorized()

  db.Product.where({growerId: request.grower.id}).order('name').all()
  .then((products) => {
    response.react(json.products, {grower: request.grower, products})
  }).catch(response.error)
})

router.post('/:growerId/image', (request, response) => {
  if (!request.canEdit) return response.unauthorized()
  request.grower.uploadImage(request).then(() => {
    response.json(json.image)
  }).catch(response.error)
})
