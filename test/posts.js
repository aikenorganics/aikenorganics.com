var test = require('tape');
var request = require('supertest');
var app = require('../app');

test('/posts/new is a 200', function(t) {
  request(app)
  .get('/posts/new')
  .expect(200)
  .end(t.end);
});

test('Fetching a missing post is a 404', function(t) {
  request(app)
  .get('/posts/123456789')
  .expect(404)
  .end(t.end);
});
