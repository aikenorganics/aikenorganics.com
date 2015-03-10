var test = require('tape');
var request = require('./helper');
var app = require('../app');
var User = require('../models').User;

test('/settings/account is a 200 as an admin', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/settings/account')
    .expect(200)
    .end(t.end);
  });
});

test('/settings/account is a 200 as a regular user', function(t) {
  var agent = request(app).signIn('user@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/settings/account')
    .expect(200)
    .end(t.end);
  });
});

test('POST /settings/account is a 302 as a regular user', function(t) {
  User.findAll({where: {email: 'user@example.com'}}).then(function(users) {
    var agent = request(app).signIn('user@example.com', function(e) {
      if (e) return t.end(e);
      agent
      .post('/settings/account')
      .field('first', users[0].first)
      .field('last', users[0].last)
      .field('phone', users[0].phone)
      .expect(302)
      .end(t.end);
    });
  });
});
