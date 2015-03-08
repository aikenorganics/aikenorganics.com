var bcrypt = require('bcrypt');
var express = require('express');
var Promise = require('sequelize').Promise;
var find = require('../mid/find');
var models = require('../models');
var Grower = models.Grower;
var Category = models.Category;
var router = module.exports = express.Router();

router.use(function(req, res, next) {
  if (req.admin) return next();
  res.status(401).render('401');
});

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

router.get('/:category_id', function(req, res) {
  Promise.all([
    Category.findAll(),
    req.category.getProducts({
      include: [{model: Grower, as: 'grower'}]
    })
  ]).spread(function(categories, products) {
    res.render('categories/show', {
      categories: categories,
      products: products
    });
  });
});
