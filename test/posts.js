var test = require('tape');
var request = require('./helper');
var app = require('../app');

test('/posts/new is a 401 logged out', function(t) {
  request(app)
  .get('/posts/new')
  .expect(401)
  .end(t.end);
});

test('/posts/new is a 200 as an admin', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/posts/new')
    .expect(200)
    .end(t.end);
  });
});

test('Fetching a missing post is a 401 logged out', function(t) {
  request(app)
  .get('/posts/123456789')
  .expect(401)
  .end(t.end);
});

test('Fetching a missing post is a 404 as an admin', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent
    .get('/posts/123456789')
    .expect(404)
    .end(t.end);
  });
});
