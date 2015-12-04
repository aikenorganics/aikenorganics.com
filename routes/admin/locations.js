'use strict'

let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()
let db = require('../../db')

// Find the location
router.find('location', () => db.Location)

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
