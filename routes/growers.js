'use strict'

const db = require('../db')
const json = require('../json/growers')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('grower', () => db.Grower)

// Authorize
router.param('grower_id', require('../mid/growers/authorize'))

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
    res.json(grower)
  }).catch(res.error)
})

// Show
router.get('/:grower_id', (req, res) => {
  const products = db.Product.where({grower_id: req.grower.id})
  if (!req.canEdit) products.where({active: true})

  products.order('name').all().then((products) => {
    res.react(json.show, {grower: req.grower, products})
  }).catch(res.error)
})

// Edit Grower
router.get('/:grower_id/edit', (req, res) => {
  if (!req.canEdit) return res.unauthorized()
  res.react(json.edit, {grower: req.grower})
})

router.post('/:grower_id', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  req.grower.update(req.permit(
    'active', 'name', 'email', 'url', 'location', 'description'
  )).then(() => {
    res.json({})
  }).catch(res.error)
})

// New Product
router.get('/:grower_id/products/new', (req, res) => {
  if (!req.canEdit) return res.unauthorized()
  db.Category.all().then((categories) => {
    res.react(json.newProduct, {grower: req.grower, categories})
  }).catch(res.error)
})

router.post('/:grower_id/products', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  const props = req.permit(
    'name', 'cost', 'unit', 'supply', 'category_id', 'description'
  )
  props.grower_id = req.grower.id

  db.Product.create(props).then((product) => {
    res.json(product)
  }).catch(res.error)
})

// Orders
router.get('/:grower_id/orders', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  db.Product
  .where({grower_id: req.grower.id})
  .where('reserved > 0')
  .all().then((products) => {
    res.react(json.orders, {grower: req.grower, products})
  }).catch(res.error)
})

// Products
router.get('/:grower_id/products', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  db.Product.where({grower_id: req.grower.id}).order('name').all()
  .then((products) => {
    res.react(json.products, {grower: req.grower, products})
  }).catch(res.error)
})

router.post('/:grower_id/image', (req, res) => {
  if (!req.canEdit) return res.unauthorized()
  req.grower.uploadImage(req).then(() => {
    res.json(req.grower)
  }).catch(res.error)
})
