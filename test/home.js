var test = require('tape');
var request = require('supertest');
var app = require('../app');

test('home page is a 200', function(t) {
  request(app)
  .get('/')
  .expect(200)
  .end(t.end);
});
