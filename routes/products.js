var express = require('express');
var find = require('../mid/find');
var upload = require('../mid/image-upload');
var Grower = require('../models').Grower;
var Product = require('../models').Product;
var Category = require('../models').Category;
var Promise = require('sequelize').Promise;
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
    ]).spread(function(grower, category) {
      req.grower = res.locals.grower = grower;
      req.category = res.locals.category = category;
      next();
    });
  }, id);
});

router.get('/', function(req, res) {
  var category_id = req.query.category_id;

  Promise.all([
    Category.findAll({order: [['position', 'ASC']]}),
    Product.findAll({
      where: category_id ? {category_id: category_id} : {},
      include: [{model: Grower, as: 'grower'}]
    })
  ]).spread(function(categories, products) {
    res.render('products/index', {
      categories: categories,
      products: products
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
  req.product.updateAttributes(req.body, {
    fields: ['name', 'cost', 'supply', 'unit', 'description', 'category_id']
  }).then(function() {
    res.flash('success', 'Saved');
    res.redirect('/products/' + req.product.id);
  });
});

router.post('/:product_id/image', authorize, upload('product'));
