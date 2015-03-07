var test = require('tape');
var request = require('./helper');
var app = require('../app');

test('/settings/account is a 200 as an admin', function(t) {
  var agent = request(app).signIn('admin@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/settings/account')
    .expect(200)
    .expect(function(res){
      if (/is_admin/.test(res.text)) return 'should not see is_admin';
    })
    .end(t.end);
  });
});

test('/settings/account is a 200 as a regular user', function(t) {
  var agent = request(app).signIn('user@example.com', function(e) {
    if (e) return t.end(e);
    agent.get('/settings/account')
    .expect(200)
    .expect(function(res){
      if (/is_admin/.test(res.text)) return 'should not see is_admin';
    })
    .end(t.end);
  });
});
