'use strict'

const db = require('../db')
const json = require('../json/growers')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('grower', () => db.Grower)

// Authorize
router.param('growerId', (req, res, next) => {
  if (!req.currentUser || !req.grower) return next()
  db.UserGrower.where({
    userId: req.currentUser.id,
    growerId: req.grower.id
  }).find().then((userGrower) => {
    req.canEdit = res.locals.canEdit = req.admin || !!userGrower
    next()
  }).catch(res.error)
})

// Index
router.get('/', (req, res) => {
  db.Grower.where({active: true}).order('name').all().then((growers) => {
    res.react(json.index, {growers})
  })
})

// New Grower
router.get('/new', (req, res) => {
  if (!req.admin) return res.unauthorized()
  res.react(json.new)
})

router.post('/', (req, res) => {
  if (!req.admin) return res.unauthorized()

  db.Grower.create(req.permit(
    'url', 'name', 'email', 'location', 'description'
  )).then((grower) => {
    res.json(json.create, {grower})
  }).catch(res.error)
})

// Show
router.get('/:growerId', (req, res) => {
  const products = db.Product.where({growerId: req.grower.id})
  if (!req.canEdit) products.where({active: true})

  products.order('name').all().then((products) => {
    res.react(json.show, {grower: req.grower, products})
  }).catch(res.error)
})

// Edit Grower
router.get('/:growerId/edit', (req, res) => {
  if (!req.canEdit) return res.unauthorized()
  res.react(json.edit, {grower: req.grower})
})

router.post('/:growerId', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  req.grower.update(req.permit(
    'active', 'name', 'email', 'url', 'location', 'description'
  )).then(() => {
    res.json({})
  }).catch(res.error)
})

// New Product
router.get('/:growerId/products/new', (req, res) => {
  if (!req.canEdit) return res.unauthorized()
  db.Category.all().then((categories) => {
    res.react(json.newProduct, {grower: req.grower, categories})
  }).catch(res.error)
})

// Create Product
router.post('/:growerId/products', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  const values = req.permit(
    'name',
    'cost',
    'unit',
    'supply',
    'categoryId',
    'description'
  )

  // Set the grower id.
  values.growerId = req.grower.id

  // Admins can set featured.
  if (req.admin) {
    Object.assign(values, req.permit('featured'))
  }

  db.Product.create(values).then((product) => {
    res.json(json.createProduct, {product})
  }).catch(res.error)
})

// Orders
router.get('/:growerId/orders', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  db.Product
  .where({growerId: req.grower.id})
  .where('reserved > 0')
  .all().then((products) => {
    res.react(json.orders, {grower: req.grower, products})
  }).catch(res.error)
})

// Products
router.get('/:growerId/products', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  db.Product.where({growerId: req.grower.id}).order('name').all()
  .then((products) => {
    res.react(json.products, {grower: req.grower, products})
  }).catch(res.error)
})

router.post('/:growerId/image', (req, res) => {
  if (!req.canEdit) return res.unauthorized()
  req.grower.uploadImage(req).then(() => {
    res.json(json.image)
  }).catch(res.error)
})
