var express = require('express');
var find = require('../mid/find');
var models = require('../models');
var Promise = require('sequelize').Promise;
var Grower = models.Grower;
var Product = models.Product;
var Category = models.Category;
var router = module.exports = express.Router();

router.param('category_id', find('category', Category));

router.get('/', function(req, res) {
  Promise.all([
    Category.findAll(),
    Product.findAll({
      include: [{model: Grower, as: 'grower'}]
    })
  ]).spread(function(categories, products) {
    res.render('market/index', {
      categories: categories,
      products: products
    });
  });
});

router.get('/category/:category_id', function(req, res) {
  Promise.all([
    Category.findAll(),
    req.category.getProducts({
      include: [{model: Grower, as: 'grower'}]
    })
  ]).spread(function(categories, products) {
    res.render('market/category', {
      categories: categories,
      products: products
    });
  });
});
