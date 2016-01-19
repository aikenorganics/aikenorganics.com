'use strict'

let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()
let db = require('../../db')

// Find the location
router.find('location', () => db.Location)

// Index
router.get('/', function (req, res) {
  db.Location.order('name').all().then((locations) => {
    res.react({locations: locations})
  }).catch(res.error)
})

// New
router.get('/new', (req, res) => res.react())

// Edit
router.get('/:location_id/edit', (req, res) => {
  res.react({location: req.location})
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
