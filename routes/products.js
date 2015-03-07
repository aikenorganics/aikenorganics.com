var express = require('express');
var find = require('../mid/find');
var adminOnly = require('../mid/admin-only');
var upload = require('../mid/image-upload');
var Grower = require('../models').Grower;
var Product = require('../models').Product;
var Category = require('../models').Category;
var Promise = require('sequelize').Promise;
var router = module.exports = express.Router();
var findProduct = find('product', Product);

router.use(adminOnly);
router.param('product_id', function(req, res, next, id) {
  findProduct(req, res, function() {
    if (!req.product) return next();
    Promise.all([
      req.product.getGrower(),
      req.product.getCategory()
    ]).spread(function(grower, category) {
      req.grower = res.locals.grower = grower;
      req.category = res.locals.category = category;
      next();
    });
  }, id);
});

router.get('/:product_id', function(req, res) {
  res.render('products/show');
});

router.get('/:product_id/edit', function(req, res) {
  Category.findAll().then(function(categories) {
    res.render('products/edit', {categories: categories});
  });
});

router.post('/:product_id', function(req, res) {
  req.product.updateAttributes(req.body, {
    fields: ['name', 'cost', 'available', 'unit', 'description', 'category_id']
  }).then(function() {
    res.flash('success', 'Saved');
    res.redirect('/products/' + req.product.id);
  });
});

router.post('/:product_id/image', upload('product'));
