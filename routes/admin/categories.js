'use strict'

const db = require('../../db')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('category', () => db.Category)

// Index
router.get('/', (req, res) => {
  db.Category.order('position').all().then((categories) => {
    res.react({categories: categories})
  })
})

// New
router.get('/new', (req, res) => {
  res.render('admin/categories/new')
})

// Edit
router.get('/:category_id/edit', (req, res) => {
  res.render('admin/categories/edit')
})

// Create
router.post('/', (req, res) => {
  db.Category.create(req.permit('name', 'position')).then(() => {
    res.flash('success', 'Created')
    res.redirect('/admin/categories')
  })
})

// Update
router.post('/:category_id', (req, res) => {
  req.category.update(req.permit('name', 'position')).then(() => {
    res.flash('success', 'Saved')
    res.redirect('/admin/categories')
  })
})

// Delete
router.delete('/:category_id', (req, res) => {
  req.category.destroy().then(() => {
    res.json({})
  }).catch(res.error)
})
