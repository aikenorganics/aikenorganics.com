var test = require('tape');
var request = require('../helper');
var app = require('../../app');
var models = require('../../models');

test('/admin/products/oversold is a 200', function(t) {
  var agent = request(app).signIn('admin@example.com', function() {
    agent
    .get('/admin/products/oversold')
    .expect(200)
    .end(t.end);
  });
});
