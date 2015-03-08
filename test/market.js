var test = require('tape');
var request = require('./helper');
var app = require('../app');

test('/market is a 404 signed out', function(t) {
  request(app)
  .get('/market')
  .expect(401)
  .end(t.end);
});

test('/market is a 200 signed in', function(t) {
  var agent = request(app).signIn('user@example.com', function() {
    agent
    .get('/market')
    .expect(200)
    .end(t.end);
  });
});
