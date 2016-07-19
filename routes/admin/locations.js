'use strict'

const db = require('../../db')
const json = require('../../json/admin/locations')
const router = module.exports = require('ozymandias').Router()

// Find the location
router.find('location', () => db.Location)

// Index
router.get('/', function (req, res) {
  db.Location.order('name').all().then((locations) => {
    res.react(json.index, {locations})
  }).catch(res.error)
})

// New
router.get('/new', (req, res) => res.react(json.new))

// Edit
router.get('/:location_id/edit', (req, res) => {
  res.react(json.edit, {location: req.location})
})

// Create
router.post('/', (req, res) => {
  db.Location.create(req.permit('name')).then(() => {
    res.json(true)
  }).catch(res.error)
})

// Update
router.post('/:location_id', (req, res) => {
  req.location.update(req.permit('name', 'active')).then(() => {
    res.json(true)
  }).catch(res.error)
})

// Destroy
router.delete('/:location_id', (req, res) => {
  req.location.destroy().then(() => res.json(true)).catch(res.error)
})
