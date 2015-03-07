var test = require('tape');
var request = require('./helper');
var app = require('../app');
var Grower = require('../models').Grower;

test('/growers/show is a 404 for missing ids', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/growers/123456789')
    .expect(404)
    .end(t.end);
  });
});

test('/growers/new is a 200', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/growers/new')
    .expect(200)
    .end(t.end);
  });
});

test('/growers/products/new is a 200 as an admin', function(t) {
  Grower.findAll().then(function(growers) {
    var agent = request(app).signIn('admin@example.com', function(e) {
      if (e) return t.end(e);
      agent.get('/growers/' + growers[0].id + '/products/new')
      .expect(200)
      .end(t.end);
    });
  });
});
