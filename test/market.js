var test = require('tape');
var request = require('./helper');
var app = require('../app');
var models = require('../models');
var Category = models.Category;

test('/market is a 200', function(t) {
  request(app)
  .get('/market')
  .expect(200)
  .end(t.end);
});

test('/market/category/show is a 200', function(t) {
  Category.findAll({limit: 1}).then(function(categories) {
    request(app)
    .get('/market/category/' + categories[0].id)
    .expect(200)
    .end(t.end);
  });
});
