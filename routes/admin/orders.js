var qs = require('qs')
var url = require('url')
var ozymandias = require('ozymandias')
var router = module.exports = ozymandias.Router()
var models = require('../../models')
var find = require('../../mid/find')

// Find the Order
router.param('order_id', find(models.Order, {
  order: '"productOrders.product"."name" asc',
  include: [{
    as: 'user',
    model: models.User
  }, {
    model: models.ProductOrder,
    as: 'productOrders',
    include: [{model: models.Product, as: 'product'}]
  }, {
    as: 'location',
    model: models.Location
  }]
}))

// Find a Product
router.get('/', function (req, res, next) {
  var id = req.query.product_id
  if (!id) return next()
  models.Product.find(id).then(function (product) {
    req.product = res.locals.product = product
    next()
  })
})

// Index
router.get('/', function (req, res) {
  var full = req.query.full === '1'
  var include = [
    {as: 'user', model: models.User},
    {as: 'location', model: models.Location}
  ]

  // Default status
  if (!Array.isArray(req.query.status)) req.query.status = ['open']

  // Default conditions
  var where = {status: {$in: req.query.status}}

  // Filter by product
  if (req.product) {
    where.id = {
      $in: models.sequelize.literal(
        `(select order_id from product_orders
        where product_id = ${models.sequelize.escape(req.product.id)})`
      )
    }
  }

  // Include models for full view
  if (full) {
    include.push({
      model: models.ProductOrder,
      as: 'productOrders',
      include: [{model: models.Product, as: 'product'}]
    })
  }

  // Generate control urls
  res.locals.controlUrl = function (name, value) {
    var query = {}
    for (var key in req.query) query[key] = req.query[key]

    if (value == null) {
      delete query[name]
    } else {
      query[name] = value
    }

    if (query.status.length === 1 && query.status[0] === 'open') {
      delete query.status
    }

    return url.format({
      pathname: '/admin/orders',
      search: qs.stringify(query, {arrayFormat: 'brackets'})
    })
  }

  // Get the orders!
  models.Order.findAll({
    where: where,
    include: include,
    order: [['created_at', 'desc']]
  }).then(function (orders) {
    var view = full ? 'admin/orders/full' : 'admin/orders/index'
    res.render(view, {orders: orders})
  })
})

// Show
router.get('/:order_id', function (req, res) {
  if (!req.order) return res.status(404).render('404')
  models.Location.findAll({
    order: [['name', 'ASC']]
  }).then(function (locations) {
    res.render('admin/orders/show', {
      locations: locations
    })
  })
})

// Update
router.post('/:order_id', function (req, res) {
  if (!req.order) return res.status(404).render('404')

  req.transaction(function (transaction) {
    return req.order.update(req.body, {
      fields: ['status', 'notes', 'location_id']
    }).then(function () {
      res.flash('success', 'Order Updated')
      res.redirect(`/admin/orders/${req.order.id}`)
    })
  })
})
