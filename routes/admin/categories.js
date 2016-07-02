'use strict'

const db = require('../../db')
const json = require('../../json/admin/categories')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('category', () => db.Category)

// Index
router.get('/', (req, res) => {
  db.Category.order('position').all().then((categories) => {
    res._react(json.index, {categories})
  }).catch(res.error)
})

// New
router.get('/new', (req, res) => res._react(json.new))

// Edit
router.get('/:category_id/edit', (req, res) => {
  res._react(json.edit, {
    category: req.category
  })
})

// Create
router.post('/', (req, res) => {
  db.Category.create(req.permit('meat', 'name', 'position')).then((category) => {
    res.json(category)
  }).catch(res.error)
})

// Update
router.post('/:category_id', (req, res) => {
  req.category.update(req.permit('meat', 'name', 'position')).then(() => {
    res.json(req.category)
  }).catch(res.error)
})

// Delete
router.delete('/:category_id', (req, res) => {
  req.category.destroy().then(() => {
    res.json({})
  }).catch(res.error)
})
