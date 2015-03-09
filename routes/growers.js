var express = require('express');
var find = require('../mid/find');
var upload = require('../mid/image-upload');
var Grower = require('../models').Grower;
var Product = require('../models').Product;
var Category = require('../models').Category;
var router = module.exports = express.Router();

function authorize(req, res, next) {
  if (req.admin) return next();
  res.status(401).render('401');
}

router.param('grower_id', find('grower', Grower));

router.get('/', function(req, res) {
  Grower.findAll({
    order: [['name', 'ASC']]
  }).then(function(growers) {
    res.render('growers/index', {
      growers: growers
    });
  });
});

router.get('/new', authorize, function(req, res) {
  res.render('growers/new');
});

router.get('/:grower_id', function(req, res) {
  req.grower.getProducts({
    order: [['name', 'ASC']]
  }).then(function(products) {
    res.render('growers/show', {
      products: products
    });
  });
});

router.get('/:grower_id/edit', authorize, function(req, res) {
  res.render('growers/edit');
});

router.post('/:grower_id', authorize, function(req, res) {
  req.grower.updateAttributes(req.body, {
    fields: ['name', 'email', 'url', 'location', 'description']
  }).then(function() {
    res.flash('success', 'Saved');
    res.redirect('/growers/' + req.grower.id);
  });
});

router.post('/', authorize, function(req, res) {
  Grower.create({
    url: req.body.url,
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    description: req.body.description
  }).then(function(grower) {
    res.flash('success', 'Saved');
    res.redirect('/growers/' + grower.id);
  });
});

router.get('/:grower_id/products/new', authorize, function(req, res) {
  Category.findAll().then(function(categories) {
    res.render('products/new', {categories: categories});
  });
});

router.post('/:grower_id/products', authorize, function(req, res) {
  req.grower.createProduct({
    name: req.body.name,
    cost: req.body.cost,
    unit: req.body.unit,
    supply: req.body.supply,
    category_id: req.body.category_id,
    description: req.body.description
  }).then(function(product) {
    res.flash('success', 'Saved');
    res.redirect('/products/' + product.id);
  });
});

router.post('/:grower_id/image', upload('grower'));
