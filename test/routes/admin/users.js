var test = require('tape')
var request = require('../request')
var models = require('../../../models')

test('POST /admin/users/:id is a 302', function (t) {
  models.User.findAll({where: {email: 'user@example.com'}}).then(function (users) {
    var agent = request().signIn('admin@example.com', function (e) {
      agent
      .post('/admin/users/' + users[0].id)
      .expect(302)
      .end(t.end)
    })
  })
})

test('/admin/users is a 200 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    if (e) return t.end(e)
    agent.get('/admin/users')
    .expect(200)
    .end(t.end)
  })
})

test('/admin/users/show is a 200 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    if (e) return t.end(e)
    request.getAdmin().then(function (user) {
      agent.get('/admin/users/' + user.id + '/edit')
      .expect(200)
      .expect(/is_admin/)
      .end(t.end)
    })
  })
})

test('missing users are a 404 as an admin', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    if (e) return t.end(e)
    agent.get('/admin/users/123456789')
    .expect(404)
    .end(t.end)
  })
})

test('/admin/users is a 401 as a regular user', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    if (e) return t.end(e)
    agent.get('/admin/users')
    .expect(401)
    .end(t.end)
  })
})

test('/admin/users/show is a 401 as a regular user', function (t) {
  var agent = request().signIn('user@example.com', function (e) {
    if (e) return t.end(e)
    request.getAdmin().then(function (user) {
      agent.get('/admin/users/' + user.id + '/edit')
      .expect(401)
      .end(t.end)
    })
  })
})
