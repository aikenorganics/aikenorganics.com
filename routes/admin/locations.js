var ozymandias = require('ozymandias')
var router = module.exports = ozymandias.Router()
var db = require('../../db')

router.param('location_id', function (req, res, next, id) {
  if (!id) return next()
  db.Location.find(id).then(function (location) {
    if (!location) return res.status(404).render('404')
    req.location = res.locals.location = location
    next()
  }).catch(next)
})

router.get('/', function (req, res) {
  db.Location.order('name').all().then(function (locations) {
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
  db.transaction(function () {
    return db.Location.create({name: req.body.name})
  }).then(function () {
    res.flash('success', 'Created')
    res.redirect('/admin/locations')
  })
})

router.post('/:location_id', function (req, res) {
  db.transaction(function () {
    return req.location.update({name: req.body.name})
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/admin/locations')
  })
})

router.post('/:location_id/delete', function (req, res) {
  db.transaction(function () {
    return req.location.destroy()
  }).then(function () {
    res.flash('success', 'Deleted.')
    res.redirect(req.body.return_to)
  })
})
