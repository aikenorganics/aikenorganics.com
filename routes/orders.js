var ozymandias = require('ozymandias')
var find = require('../mid/find')
var models = require('../models')
var router = module.exports = ozymandias.Router()

router.use(function (req, res, next) {
  if (req.user) return next()
  res.status(401).render('401')
})

router.param('order_id', find(models.Order))

// Current
router.get('/current', function (req, res) {
  Promise.all([
    models.Order.findOne({
      where: {
        status: 'open',
        user_id: req.user.id
      },
      include: [{
        model: models.ProductOrder,
        as: 'productOrders',
        include: [{model: models.Product, as: 'product'}]
      }, {
        as: 'location',
        model: models.Location
      }]
    }),
    models.Location.findAll({
      order: [['name', 'ASC']]
    })
  ]).then(function (results) {
    res.render('orders/current', {
      order: results[0],
      locations: results[1]
    })
  })
})

// Update
router.post('/:order_id', function (req, res) {
  if (!req.market.open) return res.status(401).render('401')

  // You can only update your own order.
  if (req.user.id !== req.order.user_id) {
    return res.status(401).render('401')
  }

  req.transaction(function (transaction) {
    return req.order.update(req.body, {
      transaction: transaction,
      fields: ['location_id']
    }).then(function () {
      res.flash('success', 'Saved')
      res.redirect('/orders/current')
    })
  })
})

// Cancel
router.post('/:order_id/cancel', function (req, res) {
  if (!req.market.open) return res.status(401).render('401')

  // You can only cancel your own order.
  if (req.user.id !== req.order.user_id) {
    return res.status(401).render('401')
  }

  req.transaction(function (t) {
    return req.order.destroy({transaction: t}).then(function () {
      res.flash('success', 'Order cancelled.')
      res.redirect('/products')
    })
  })
})
