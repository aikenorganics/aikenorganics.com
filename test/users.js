var test = require('tape');
var request = require('./helper');
var app = require('../app');
var User = require('../models').User;

test('/users is a 200 as an admin', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/users')
    .expect(200)
    .end(t.end);
  });
});

test('/users/show is a 200 as an admin', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    request.getAdmin().then(function(user) {
      agent.get('/users/' + user.id + '/edit')
      .expect(200)
      .expect(/is_admin/)
      .end(t.end);
    });
  });
});

test('missing users are a 404 as an admin', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/users/123456789')
    .expect(404)
    .end(t.end);
  });
});

test('/users is a 401 as a regular user', function(t) {
  var agent = request(app).signIn('user@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/users')
    .expect(401)
    .end(t.end);
  });
});

test('/users/show is a 401 as a regular user', function(t) {
  var agent = request(app).signIn('user@example.com', function(e) {
    if (e) return t.end(e);
    request.getAdmin().then(function(user) {
      agent.get('/users/' + user.id + '/edit')
      .expect(401)
      .end(t.end);
    });
  });
});
