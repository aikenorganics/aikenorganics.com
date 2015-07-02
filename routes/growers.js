var ozymandias = require('ozymandias')
var upload = require('../mid/image-upload')
var models = require('../models')
var router = module.exports = ozymandias.Router()

// Find
router.param('grower_id', require('../mid/find')(models.Grower))

// Authorize
router.param('grower_id', require('../mid/growers/authorize'))

// Index
router.get('/', function (req, res) {
  models.Grower.findAll({
    where: {active: true},
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

  req.transaction(function (transaction) {
    return models.Grower.create(req.body, {
      fields: ['url', 'name', 'email', 'location', 'description'],
      transaction: transaction
    }).then(function (grower) {
      res.flash('success', 'Saved')
      res.redirect(`/growers/${grower.id}`)
    })
  })
})

// Show
router.get('/:grower_id', function (req, res) {
  var where = {}
  if (!req.canEdit) where.active = true

  req.grower.getProducts({
    where: where,
    order: [['name', 'ASC']]
  }).then(function (products) {
    // Stupid, but necessary.
    products.forEach(function (product) { product.grower = req.grower })
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

  req.transaction(function (transaction) {
    return req.grower.update(req.body, {
      fields: ['name', 'email', 'url', 'location', 'description'],
      transaction: transaction
    }).then(function () {
      res.flash('success', 'Saved')
      res.redirect('/growers/' + req.grower.id)
    })
  })
})

// New Product
router.get('/:grower_id/products/new', newProduct)

function newProduct (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  models.Category.findAll().then(function (categories) {
    res.render('products/new', {categories: categories})
  })
}

router.post('/:grower_id/products', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  var product = models.Product.build(req.body, {
    attributes: [
      'name', 'cost', 'unit', 'supply', 'category_id', 'description'
    ]
  })
  product.grower_id = req.grower.id

  req.transaction(function (transaction) {
    return product.save({
      transaction: transaction
    }).then(function () {
      res.flash('success', 'Saved')
      res.redirect(`/products/${product.id}`)
    }).catch(function (error) {
      res.status(422)
      res.locals.error = error
      res.locals.product = product
      newProduct(req, res)
    })
  })
})

// Orders
router.get('/:grower_id/orders', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  var attrs = []
  for (var attr in models.Product.attributes) attrs.push(attr)
  attrs.push([`(
    select sum(quantity * cost) from product_orders
    inner join orders on orders.id = product_orders.order_id
    where product_id = products.id and orders.status = 'open'
  )`, 'total'])

  req.grower.getProducts({
    attributes: attrs,
    where: {reserved: {gt: 0}}
  }).then(function (products) {
    res.render('growers/orders', {products: products})
  })
})

router.post('/:grower_id/image', upload('grower'))

router.post('/:grower_id/image', function (req, res, next) {
  if (!req.canEdit) return res.status(401).render('401')
  next()
}, require('../mid/image-upload')('grower'))
