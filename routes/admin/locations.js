'use strict'

const db = require('../../db')
const json = require('../../json/admin/locations')
const router = module.exports = require('ozymandias').Router()

// Find the location
router.find('location', () => db.Location)

// Index
router.get('/', (request, response) => {
  db.Location.order('name').all().then((locations) => {
    response.react(json.index, {locations})
  }).catch(response.error)
})

// New
router.get('/new', (request, response) => response.react(json.new))

// Edit
router.get('/:locationId/edit', (request, response) => {
  response.react(json.edit, {location: request.location})
})

// Create
router.post('/', (request, response) => {
  db.Location.create(request.permit('name')).then(() => {
    response.json({})
  }).catch(response.error)
})

// Update
router.post('/:locationId', (request, response) => {
  request.location.update(request.permit('name', 'active')).then(() => {
    response.json({})
  }).catch(response.error)
})

// Destroy
router.delete('/:locationId', (request, response) => {
  request.location.destroy().then(() => response.json({})).catch(response.error)
})
