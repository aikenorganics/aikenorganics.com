'use strict'

const db = require('../../db')
const json = require('../../json/admin/categories')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('category', () => db.Category)

// Index
router.get('/', (request, response) => {
  db.Category
  .select('not exists(select 1 from products where category_id = categories.id) as removable')
  .order('position').all().then((categories) => {
    response.react(json.index, {categories})
  }).catch(response.error)
})

// New
router.get('/new', (request, response) => response.react(json.new))

// Edit
router.get('/:categoryId/edit', (request, response) => {
  response.react(json.edit, {
    category: request.category
  })
})

// Create
router.post('/', (request, response) => {
  db.Category.create(request.permit('meat', 'name', 'position')).then((category) => {
    response.json(json.create, {category})
  }).catch(response.error)
})

// Update
router.post('/:categoryId', (request, response) => {
  request.category.update(request.permit('meat', 'name', 'position')).then(() => {
    response.json(json.update)
  }).catch(response.error)
})

// Delete
router.delete('/:categoryId', (request, response) => {
  request.category.destroy().then(() => {
    response.json({})
  }).catch(response.error)
})
