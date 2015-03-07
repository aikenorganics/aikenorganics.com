var test = require('tape');
var request = require('./helper');
var app = require('../app');
var Product = require('../models').Product;

test('/products/show is a 200 as an admin', function(t) {
  Product.findAll().then(function(products) {
    var agent = request(app).signIn('admin@example.com', function(e) {
      if (e) return t.end(e);
      agent.get('/products/' + products[0].id)
      .expect(200)
      .end(t.end);
    });
  });
});
