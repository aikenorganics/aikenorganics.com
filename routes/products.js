var express = require('express')
var find = require('../mid/find')
var upload = require('../mid/image-upload')
var models = require('../models')
var router = module.exports = express.Router()

function authorize (req, res, next) {
  if (req.admin) return next()
  res.status(401).render('401')
}

// Find
router.param('product_id', find(models.Product, {
  include: [
    {model: models.Grower, as: 'grower'},
    {model: models.Category, as: 'category'}
  ]
}))

// Authorize
router.param('product_id', require('../mid/products/authorize'))

// Index
router.get('/', function (req, res) {
  var category_id = req.query.category_id

  Promise.all([
    models.Category.findAll({order: [['position', 'ASC']]}),
    models.Product.findAll({
      order: [['name', 'ASC']],
      where: category_id ? {category_id: category_id} : {},
      include: [{model: models.Grower, as: 'grower'}]
    })
  ]).then(function (results) {
    res.render('products/index', {
      categories: results[0],
      products: results[1]
    })
  })
})

// Show
router.get('/:product_id', function (req, res) {
  res.render('products/show')
})

// Edit
router.get('/:product_id/edit', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  models.Category.findAll({
    order: [['position', 'ASC']]
  }).then(function (categories) {
    res.render('products/edit', {categories: categories})
  })
})

// Update
router.post('/:product_id', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  req.product.update(req.body, {
    fields: ['name', 'cost', 'supply', 'unit', 'description', 'category_id']
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/products/' + req.product.id)
  })
})

router.post('/:product_id/image', authorize, upload('product'))
