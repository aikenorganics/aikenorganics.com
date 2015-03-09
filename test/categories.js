var test = require('tape');
var request = require('./helper');
var app = require('../app');
var models = require('../models');
var Category = models.Category;

test('GET /categories/show is a 404 for missing ids', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    agent.get('/categories/123456789')
    .expect(404)
    .end(t.end);
  });
});

test('GET /categories/new is a 200', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    agent.get('/categories/new')
    .expect(200)
    .end(t.end);
  });
});

test('GET /categories/:id/edit is a 200', function(t) {
  Category.findAll({limit: 1}).then(function(categories) {
    var agent = request(app).signIn('admin@example.com', function(e) {
      agent.get('/categories/' + categories[0].id + '/edit')
      .expect(200)
      .end(t.end);
    });
  });
});

test('POST /categories is a 302', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    agent.post('/categories')
    .field('name', 'Test')
    .field('position', '2')
    .expect(302)
    .end(t.end);
  });
});

test('POST /categories/:id is a 302', function(t) {
  Category.findAll({limit: 1}).then(function(categories) {
    var agent = request(app).signIn('admin@example.com', function(e) {
      agent.post('/categories/' + categories[0].id)
      .field('name', categories[0].name)
      .field('position', categories[0].position)
      .expect(302)
      .end(t.end);
    });
  });
});
