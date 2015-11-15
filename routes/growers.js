'use strict'

let db = require('../db')
let find = require('../mid/find')
let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

// Find
router.param('grower_id', find('grower', function () { return db.Grower }))

// Authorize
router.param('grower_id', require('../mid/growers/authorize'))

// Index
router.get('/', function (req, res) {
  db.Grower.where({active: true}).order('name').all().then(function (growers) {
    res.render('growers/index', {growers: growers})
  })
})

// New Grower
router.get('/new', function (req, res) {
  if (!req.admin) return res.status(401).render('401')
  res.render('growers/new')
})

router.post('/', function (req, res) {
  if (!req.admin) return res.status(401).render('401')

  db.transaction(function () {
    db.Grower.create(req.permit(
      'url', 'name', 'email', 'location', 'description'
    )).then(function (grower) {
      res.flash('success', 'Saved')
      res.redirect(`/growers/${grower.id}`)
    })
  }).catch(res.error)
})

// Show
router.get('/:grower_id', function (req, res) {
  let products = db.Product.where({grower_id: req.grower.id})
  if (!req.canEdit) products.where({active: true})

  products.order('name').all().then(function (products) {
    // Stupid, but necessary.
    for (let product of products) product.grower = req.grower
    res.render('growers/show', {products: products})
  }).catch(res.error)
})

// Edit Grower
router.get('/:grower_id/edit', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')
  res.render('growers/edit')
})

router.post('/:grower_id', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  db.transaction(function () {
    req.grower.update(req.permit(
      'name', 'email', 'url', 'location', 'description'
    ))
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect(`/growers/${req.grower.id}`)
  }).catch(res.error)
})

// New Product
router.get('/:grower_id/products/new', newProduct)

function newProduct (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  db.Category.all().then(function (categories) {
    res.render('products/new', {categories: categories})
  })
}

router.post('/:grower_id/products', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  let props = req.permit(
    'name', 'cost', 'unit', 'supply', 'category_id', 'description'
  )
  props.grower_id = req.grower.id

  db.transaction(function () {
    db.Product.create(props).then(function (product) {
      res.flash('success', 'Saved')
      res.redirect(`/products/${product.id}`)
    })
  }).catch(function (e) {
    if (e.message !== 'invalid') throw e
    res.status(422)
    res.locals.errors = e.model.errors
    res.locals.product = e.model
    newProduct(req, res)
  }).catch(res.error)
})

// Orders
router.get('/:grower_id/orders', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  let total = `(
    select sum(quantity * cost) from product_orders
    inner join orders on orders.id = product_orders.order_id
    where product_id = products.id and orders.status = 'open'
  ) as total`

  db.Product
  .select('*', total)
  .where({grower_id: req.grower.id})
  .where('reserved > 0')
  .all().then(function (products) {
    res.render('growers/orders', {products: products})
  }).catch(res.error)
})

// Products
router.get('/:grower_id/products', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  db.Product.where({grower_id: req.grower.id}).order('name').all()
  .then(function (products) {
    res.render('growers/products', {products: products})
  }).catch(res.error)
})

router.post('/:grower_id/image', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')
  req.grower.uploadImage(req.files.image[0]).then(() => {
    res.flash('Image Uploaded.')
    res.redirect(req.body.return_to)
  }).catch(res.error)
})
