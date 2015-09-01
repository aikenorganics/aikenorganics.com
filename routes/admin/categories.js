'use strict'

let ozymandias = require('ozymandias')
let find = require('../../mid/_find')
let db = require('../../db')
let router = module.exports = ozymandias.Router()

// Find
router.param('category_id', find('category', function () {
  return db.Category
}))

// Index
router.get('/', function (req, res) {
  db.Category.order('position').all().then(function (categories) {
    res.render('admin/categories/index', {categories: categories})
  })
})

// New
router.get('/new', function (req, res) {
  res.render('admin/categories/new')
})

// Edit
router.get('/:category_id/edit', function (req, res) {
  res.render('admin/categories/edit')
})

// Create
router.post('/', function (req, res) {
  db.transaction(function () {
    db.Category.create(req.permit('name', 'position'))
  }).then(function () {
    res.flash('success', 'Created')
    res.redirect('/admin/categories')
  })
})

// Update
router.post('/:category_id', function (req, res) {
  db.transaction(function () {
    req.category.update(req.permit('name', 'position'))
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/admin/categories')
  })
})

// Delete
router.post('/:category_id/delete', function (req, res) {
  db.transaction(function () {
    req.category.destroy()
  }).then(function () {
    res.flash('success', 'Deleted')
    res.redirect('/admin/categories')
  })
})
