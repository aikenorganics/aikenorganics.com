var test = require('tape');
var request = require('./helper');
var app = require('../app');
var models = require('../models');
var Category = models.Category;

test('/categories/show is a 404 for missing ids', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/categories/123456789')
    .expect(404)
    .end(t.end);
  });
});

test('/categories/new is a 200', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/categories/new')
    .expect(200)
    .end(t.end);
  });
});
