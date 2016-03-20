'use strict'

const db = require('../../db')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('category', () => db.Category)

// Index
router.get('/', (req, res) => {
  db.Category.order('position').all().then((categories) => {
    res.react({categories: categories})
  }).catch(res.error)
})

// New
router.get('/new', (req, res) => res.react())

// Edit
router.get('/:category_id/edit', (req, res) => {
  res.react({category: req.category})
})

// Create
router.post('/', (req, res) => {
  db.Category.create(req.permit('name', 'position')).then((category) => {
    res.json(category)
  }).catch(res.error)
})

// Update
router.post('/:category_id', (req, res) => {
  req.category.update(req.permit('name', 'position')).then(() => {
    res.json(req.category)
  }).catch(res.error)
})

// Delete
router.delete('/:category_id', (req, res) => {
  req.category.destroy().then(() => {
    res.json({})
  }).catch(res.error)
})
