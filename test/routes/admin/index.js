require('./users')
require('./orders')
require('./growers')
require('./products')
require('./categories')

var test = require('tape')
var request = require('../request')

test('/admin is a 401 signed out', function (t) {
  request()
  .get('/admin')
  .expect(401)
  .end(t.end)
})

test('/admin is a 401 as a regular user', function (t) {
  var agent = request().signIn('user@example.com', function () {
    agent
    .get('/admin')
    .expect(401)
    .end(t.end)
  })
})

test('/admin is a 404 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function () {
    agent
    .get('/admin')
    .expect(404)
    .end(t.end)
  })
})
