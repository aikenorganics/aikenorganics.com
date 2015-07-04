var ozymandias = require('ozymandias')
var find = require('../../mid/find')
var models = require('../../models')
var router = module.exports = ozymandias.Router()

router.param('location_id', find(models.Location))

router.get('/', function (req, res) {
  models.Location.findAll({
    order: [['name', 'ASC']]
  }).then(function (locations) {
    res.render('admin/locations/index', {
      locations: locations
    })
  })
})

router.get('/new', function (req, res) {
  res.render('admin/locations/new')
})

router.get('/:location_id/edit', function (req, res) {
  res.render('admin/locations/edit')
})

router.post('/', function (req, res) {
  req.transaction(function (transaction) {
    return models.Location.create(req.body, {
      transaction: transaction,
      fields: ['name']
    }).then(function () {
      res.flash('success', 'Created')
      res.redirect('/admin/locations')
    })
  })
})

router.post('/:location_id', function (req, res) {
  req.transaction(function (transaction) {
    return req.location.update(req.body, {
      transaction: transaction,
      fields: ['name']
    }).then(function () {
      res.flash('success', 'Saved')
      res.redirect('/admin/locations')
    })
  })
})

router.post('/:location_id/delete', function (req, res) {
  req.transaction(function (transaction) {
    return req.location.destroy({
      transaction: transaction
    }).then(function () {
      res.flash('success', 'Deleted.')
      res.redirect(req.body.return_to)
    })
  })
})
