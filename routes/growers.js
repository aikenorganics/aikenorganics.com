var express = require('express');
var Grower = require('../models').Grower;
var Product = require('../models').Product;

var router = module.exports = express.Router();

// Find the grower!
router.param('grower_id', function(req, res, next, id) {
  if (!id) return next();
  Grower.find(id).then(function(grower) {
    if (!grower) {
      res.status(404).render('404');
      return;
    }
    req.grower = res.locals.grower = grower;
    next();
  });
});

// Just admins for now.
router.use(function(req, res, next) {
  if (req.user && req.user.isAdmin()) return next();
  res.status(401).render('401');
});

router.get('/', function(req, res) {
  Grower.findAll().then(function(growers) {
    res.render('growers/index', {
      growers: growers
    });
  });
});

router.get('/new', function(req, res) {
  res.render('growers/new');
});

router.get('/:grower_id', function(req, res) {
  req.grower.getProducts().then(function(products) {
    res.render('growers/show', {
      products: products
    });
  });
});

router.get('/:grower_id/edit', function(req, res) {
  res.render('growers/edit');
});

router.post('/:grower_id', function(req, res) {
  req.grower.updateAttributes(req.body, {
    fields: ['name', 'email', 'url', 'location', 'description']
  }).then(function() {
    res.redirect('/growers/' + req.grower.id);
  });
});

router.post('/', function(req, res) {
  Grower.create({
    url: req.body.url,
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    description: req.body.description
  }).then(function(grower) {
    res.redirect('/growers/' + grower.id);
  });
});

router.get('/:grower_id/products/new', function(req, res) {
  res.render('products/new');
});

router.post('/:grower_id/products', function(req, res) {
  req.grower.createProduct({
    name: req.body.name,
    cost: req.body.cost,
    unit: req.body.unit,
    available: req.body.available,
    description: req.body.description
  }).then(function(product) {
    res.redirect('/products/' + product.id);
  });
});
