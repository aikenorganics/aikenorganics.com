var test = require('tape');
var request = require('supertest');
var app = require('../app');

var cookie = require('cookie');
var sign = require('cookie-signature').sign;

test('signup page is a 200', function(t) {
  request(app)
  .get('/signup')
  .expect(200)
  .end(t.end);
});

test('signup page is a 200 with a missing user', function(t) {
  request(app)
  .get('/signup')
  .set('Cookie', cookie.serialize(
    'aikenorganics-user-id',
    's:' + sign('123456789', process.env.SECRET)
  ) + ';')
  .expect(200)
  .end(t.end);
});
