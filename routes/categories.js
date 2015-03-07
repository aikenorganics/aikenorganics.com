var bcrypt = require('bcrypt');
var express = require('express');
var find = require('../mid/find');
var adminOnly = require('../mid/admin-only');
var Category = require('../models').Category;
var router = module.exports = express.Router();

router.use(adminOnly);
router.param('category_id', find('category', Category));

router.get('/', function(req, res) {
  Category.findAll().then(function(categories) {
    res.render('categories/index', {
      categories: categories
    });
  });
});

router.get('/new', function(req, res) {
  res.render('categories/new');
});

router.get('/:category_id/edit', function(req, res) {
  res.render('categories/edit');
});

router.post('/', function(req, res) {
  Category.create({
    name: req.body.name,
  }).then(function(grower) {
    res.flash('success', 'Created');
    res.redirect('/categories');
  });
});

router.post('/:category_id', function(req, res) {
  req.category.updateAttributes(req.body, {
    fields: ['name']
  }).then(function() {
    res.flash('success', 'Saved');
    res.redirect('/categories');
  });
});
