var express = require('express');
var find = require('../mid/find');
var adminOnly = require('../mid/admin-only');
var Grower = require('../models').Grower;
var Product = require('../models').Product;
var router = module.exports = express.Router();
var findProduct = find('product', Product);

router.use(adminOnly);
router.param('product_id', function(req, res, next, id) {
  findProduct(req, res, function() {
    if (!req.product) return next();
    req.product.getGrower().then(function(grower) {
      req.grower = res.locals.grower = grower;
      next();
    });
  }, id);
});

router.get('/:product_id', function(req, res) {
  res.render('products/show');
});

router.get('/:product_id/edit', function(req, res) {
  res.render('products/edit');
});

router.post('/:product_id', function(req, res) {
  req.product.updateAttributes(req.body, {
    fields: ['name', 'cost', 'available', 'unit', 'description']
  }).then(function() {
    res.redirect('/products/' + req.product.id);
  });
});
