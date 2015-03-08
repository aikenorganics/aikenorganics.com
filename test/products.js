var test = require('tape');
var request = require('./helper');
var app = require('../app');
var models = require('../models');
var Product = models.Product;
var Category = models.Category;

test('GET /products/show is a 200 as an admin', function(t) {
  Product.findAll({limit: 1}).then(function(products) {
    request(app)
    .get('/products/' + products[0].id)
    .expect(200)
    .end(t.end);
  });
});

test('GET /products/edit is a 401 as a non-admin', function(t) {
  Product.findAll().then(function(products) {
    var agent = request(app).signIn('user@example.com', function(e) {
      agent.get('/products/' + products[0].id + '/edit')
      .expect(401)
      .end(t.end);
    });
  });
});

test('GET /products/edit is a 200 as an admin', function(t) {
  Product.findAll().then(function(products) {
    var agent = request(app).signIn('admin@example.com', function(e) {
      agent.get('/products/' + products[0].id + '/edit')
      .expect(200)
      .end(t.end);
    });
  });
});

test('POST /products/:id is a 302 as an admin', function(t) {
  Product.findAll().then(function(products) {
    var agent = request(app).signIn('admin@example.com', function(e) {
      agent.post('/products/' + products[0].id)
      .field('name', products[0].name)
      .expect(302)
      .end(t.end);
    });
  });
});

test('POST /products/:id is a 401 as a non-admin', function(t) {
  Product.findAll().then(function(products) {
    var agent = request(app).signIn('user@example.com', function(e) {
      agent.post('/products/' + products[0].id)
      .field('name', products[0].name)
      .expect(401)
      .end(t.end);
    });
  });
});

test('POST /products/:id/image is a 401 as a non-admin', function(t) {
  Product.findAll().then(function(products) {
    var agent = request(app).signIn('user@example.com', function(e) {
      agent.post('/products/' + products[0].id)
      .expect(401)
      .end(t.end);
    });
  });
});

test('GET /products is a 200', function(t) {
  request(app)
  .get('/products')
  .expect(200)
  .end(t.end);
});

test('GET /products?category_id=:id is a 200', function(t) {
  Category.findAll({limit: 1}).then(function(categories) {
    request(app)
    .get('/products?category_id=' + categories[0].id)
    .expect(200)
    .end(t.end);
  });
});
