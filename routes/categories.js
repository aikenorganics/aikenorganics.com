var bcrypt = require('bcrypt');
var express = require('express');
var Category = require('../models').Category;

var router = module.exports = express.Router();

router.use(function(req, res, next) {
  if (req.user && req.user.isAdmin()) return next();
  res.status(401).render('401');
});

router.param('category_id', function(req, res, next, id) {
  if (!id) return next();
  Category.find(id).then(function(category) {
    if (!category) {
      res.status(404).render('404');
      return;
    }
    req.category = res.locals.category = category;
    next();
  });
});

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
