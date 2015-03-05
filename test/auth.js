var test = require('tape');
var request = require('supertest');
var app = require('../app');

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
