var ozymandias = require('ozymandias')
var router = module.exports = ozymandias.Router()
var db = require('../../db')

// Find the location
router.param('location_id', function (req, res, next, id) {
  if (!id) return next()
  db.Location.find(id).then(function (location) {
    if (!location) return res.status(404).render('404')
    req.location = res.locals.location = location
    next()
  }).catch(next)
})

// Index
router.get('/', function (req, res) {
  db.Location.order('name').all().then(function (locations) {
    res.render('admin/locations/index', {
      locations: locations
    })
  })
})

// New
router.get('/new', function (req, res) {
  res.render('admin/locations/new')
})

// Edit
router.get('/:location_id/edit', function (req, res) {
  res.render('admin/locations/edit')
})

// Create
router.post('/', function (req, res) {
  db.transaction(function () {
    return db.Location.create(req.permit('name'))
  }).then(function () {
    res.flash('success', 'Created')
    res.redirect('/admin/locations')
  })
})

// Update
router.post('/:location_id', function (req, res) {
  db.transaction(function () {
    return req.location.update(req.permit('name'))
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/admin/locations')
  })
})

// Destroy
router.post('/:location_id/delete', function (req, res) {
  db.transaction(function () {
    return req.location.destroy()
  }).then(function () {
    res.flash('success', 'Deleted.')
    res.redirect(req.body.return_to)
  })
})
