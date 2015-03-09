var express = require('express');
var find = require('../mid/find');
var upload = require('../mid/image-upload');
var Grower = require('../models').Grower;
var Product = require('../models').Product;
var Category = require('../models').Category;
var router = module.exports = express.Router();
var findProduct = find('product', Product);

function authorize(req, res, next) {
  if (req.admin) return next();
  res.status(401).render('401');
}

router.param('product_id', function(req, res, next, id) {
  findProduct(req, res, function() {
    if (!req.product) return next();
    Promise.all([
      req.product.getGrower(),
      req.product.getCategory()
    ]).then(function(results) {
      req.grower = res.locals.grower = results[0];
      req.category = res.locals.category = results[1];
      next();
    });
  }, id);
});

router.get('/', function(req, res) {
  var category_id = req.query.category_id;

  Promise.all([
    Category.findAll({order: [['position', 'ASC']]}),
    Product.findAll({
      order: [['name', 'ASC']],
      where: category_id ? {category_id: category_id} : {},
      include: [{model: Grower, as: 'grower'}]
    })
  ]).then(function(results) {
    res.render('products/index', {
      categories: results[0],
      products: results[1]
    });
  });
});

router.get('/:product_id', function(req, res) {
  res.render('products/show');
});

router.get('/:product_id/edit', authorize, function(req, res) {
  Category.findAll({order: [['position', 'ASC']]}).then(function(categories) {
    res.render('products/edit', {categories: categories});
  });
});

router.post('/:product_id', authorize, function(req, res) {
  req.product.update(req.body, {
    fields: ['name', 'cost', 'supply', 'unit', 'description', 'category_id']
  }).then(function() {
    res.flash('success', 'Saved');
    res.redirect('/products/' + req.product.id);
  });
});

router.post('/:product_id/image', authorize, upload('product'));
