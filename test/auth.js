var test = require('tape');
var request = require('./helper');
var app = require('../app');
var User = require('../models').User;
var Token = require('../models').Token;

test('signup page is a 200', function(t) {
  request(app)
  .get('/auth/signup')
  .expect(200)
  .end(t.end);
});

test('Can sign in with password', function(t) {
  request(app)
  .post('/auth/signin')
  .field('email', 'admin@example.com')
  .field('password', 'password')
  .expect(302)
  .end(t.end);
});

test('GET /auth/forgot is a 200', function(t) {
  request(app)
  .get('/auth/forgot')
  .expect(200)
  .end(t.end);
});

test('POST /auth/forgot is a 404 for missing emails', function(t) {
  request(app)
  .post('/auth/forgot')
  .field('email', 'does@not.exist')
  .expect(404)
  .end(t.end);
});

test('POST /auth/forgot is a 302 for existing emails', function(t) {
  request(app)
  .post('/auth/forgot')
  .field('email', 'admin@example.com')
  .expect(302)
  .end(t.end);
});

test('GET /auth/reset is a 404 for missing tokens', function(t) {
  request(app)
  .get('/auth/reset/doesnotexist')
  .expect(404)
  .end(t.end);
});

test('GET /auth/reset is a 200 for valid tokens', function(t) {
  var agent = request(app);
  agent.post('/auth/forgot')
  .field('email', 'admin@example.com')
  .expect(302)
  .end(function() {
    Token.findAll({order: [['expires_at', 'DESC']]}).then(function(tokens) {
      agent.get('/auth/reset/' + tokens[0].id)
      .expect(200)
      .end(t.end);
    });
  });
});

test('POST /auth/reset is a 302 for valid tokens', function(t) {
  var agent = request(app);
  agent.post('/auth/forgot')
  .field('email', 'admin@example.com')
  .expect(302)
  .end(function() {
    Token.findAll({order: [['expires_at', 'DESC']]}).then(function(tokens) {
      agent.post('/auth/reset')
      .field('token', tokens[0].id)
      .field('password', 'password')
      .expect(302)
      .end(t.end);
    });
  });
});

test('POST /auth/reset is a 404 for missing tokens', function(t) {
  request(app)
  .post('/auth/reset')
  .field('token', 'does not exist')
  .field('password', 'password')
  .expect(404)
  .end(t.end);
});

test('POST /auth/reset enforces password length of 8', function(t) {
  request(app)
  .post('/auth/reset')
  .field('token', 'does not exist')
  .field('password', 'secret')
  .expect(422)
  .end(t.end);
});
