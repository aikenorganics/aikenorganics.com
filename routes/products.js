var express = require('express');
var Grower = require('../models').Grower;
var Product = require('../models').Product;

var router = module.exports = express.Router();

router.use(require('../mid/admin-only'));

// Find the product!
router.param('product_id', function(req, res, next, id) {
  if (!id) return next();
  Product.find(id).then(function(product) {
    if (!product) {
      res.status(404).render('404');
      return;
    }
    req.product = res.locals.product = product;
    product.getGrower().then(function(grower) {
      req.grower = res.locals.grower = grower;
      next();
    });
  });
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
