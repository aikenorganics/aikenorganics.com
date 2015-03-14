var express = require('express')
var upload = require('../mid/image-upload')
var models = require('../models')
var router = module.exports = express.Router()

// Find
router.param('grower_id', require('../mid/find')(models.Grower))

// Authorize
router.param('grower_id', require('../mid/growers/authorize'))

// Index
router.get('/', function (req, res) {
  models.Grower.findAll({
    order: [['name', 'ASC']]
  }).then(function (growers) {
    res.render('growers/index', {
      growers: growers
    })
  })
})

// New Grower
router.get('/new', function (req, res) {
  if (!req.admin) return res.status(401).render('401')
  res.render('growers/new')
})

router.post('/', function (req, res) {
  if (!req.admin) return res.status(401).render('401')

  models.Grower.create({
    url: req.body.url,
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    description: req.body.description
  }).then(function (grower) {
    res.flash('success', 'Saved')
    res.redirect('/growers/' + grower.id)
  })
})

// Show
router.get('/:grower_id', function (req, res) {
  req.grower.getProducts({
    order: [['name', 'ASC']]
  }).then(function (products) {
    res.render('growers/show', {
      products: products
    })
  })
})

// Edit Grower
router.get('/:grower_id/edit', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')
  res.render('growers/edit')
})

router.post('/:grower_id', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  req.grower.update(req.body, {
    fields: ['name', 'email', 'url', 'location', 'description']
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/growers/' + req.grower.id)
  })
})

// New Product
router.get('/:grower_id/products/new', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  models.Category.findAll().then(function (categories) {
    res.render('products/new', {categories: categories})
  })
})

router.post('/:grower_id/products', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  req.grower.createProduct({
    name: req.body.name,
    cost: req.body.cost,
    unit: req.body.unit,
    supply: req.body.supply,
    category_id: req.body.category_id,
    description: req.body.description
  }).then(function (product) {
    res.flash('success', 'Saved')
    res.redirect('/products/' + product.id)
  })
})

// Orders
router.get('/:grower_id/orders', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  req.grower.getProducts({
    where: {reserved: {gt: 0}}
  }).then(function (products) {
    res.render('growers/orders', {products: products})
  })
})

router.post('/:grower_id/image', upload('grower'))
