'use strict'

let db = require('../db')
let find = require('../mid/find')
let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

// Find
router.param('product_id', find('product', function () {
  return db.Product.include('grower', 'category')
}))

// Authorize
router.param('product_id', require('../mid/products/authorize'))

// Index
router.get('/', function (req, res) {
  let products = db.Product
    .include('grower').join('grower')
    .where({active: true, grower: {active: true}})

  // Search
  if (req.query.search) {
    products.where(
      "search @@ to_tsquery('simple', ?)", `${req.query.search}:*`
    )
  }

  // Category
  if (req.query.category_id) {
    products.where({category_id: req.query.category_id})
  }

  // Pagination
  let page = res.locals.page = +(req.query.page || 1)

  res.format({
    html: () => {
      Promise.all([
        products.order('name').paginate(page, 30),
        db.Category.order('position').all()
      ]).then(function (results) {
        res.render('products/index', {
          products: results[0],
          categories: results[1]
        })
      }).catch(res.error)
    },
    json: () => {
      products.order('name').all().then((products) => {
        res.json(products)
      })
    }
  })
})

// Show
router.get('/:product_id', function (req, res) {
  res.render('products/show')
})

// Edit
router.get('/:product_id/edit', editProduct)

function editProduct (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  db.Category.order('position').all().then(function (categories) {
    res.render('products/edit', {categories: categories})
  }).catch(res.error)
}

// Update
router.post('/:product_id', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  db.transaction(function () {
    req.product.update(req.permit(
      'active', 'category_id', 'cost', 'description', 'name', 'supply', 'unit'
    ))
  }).then(function () {
    res.format({
      html: () => {
        res.flash('success', 'Saved')
        res.redirect(req.body.return_to || `/products/${req.product.id}`)
      },
      json: () => {
        res.json({})
      }
    })
  }).catch(function (e) {
    if (e.message !== 'invalid') throw e
    res.status(422)
    res.locals.errors = req.product.errors
    editProduct(req, res)
  }).catch(res.error)
})

// Image
router.post('/:product_id/image', function (req, res, next) {
  if (!req.canEdit) return res.status(401).render('401')
  next()
}, require('../mid/image-upload')('product'))
