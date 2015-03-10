var test = require('tape');
var request = require('../helper');
var app = require('../../app');
var models = require('../../models');

test('/admin/orders is a 200', function(t) {
  var agent = request(app).signIn('admin@example.com', function() {
    agent
    .get('/admin/orders')
    .expect(200)
    .end(t.end);
  });
});

test('/admin/orders is a 200', function(t) {
  models.Order.findOne({}).then(function(order) {
    var agent = request(app).signIn('admin@example.com', function() {
      agent
      .get(`/admin/orders/${order.id}`)
      .expect(200)
      .end(t.end);
    });
  });
});
