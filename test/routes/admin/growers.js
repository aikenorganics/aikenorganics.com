var test = require('tape')
var request = require('../request')
var models = require('../../../models')

test('GET /admin/growers is a 200', function (t) {
  var agent = request().signIn('admin@example.com', function (e) {
    agent.get('/admin/growers')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/growers/:id/edit is a 200', function (t) {
  models.Grower.findOne({}).then(function (grower) {
    var agent = request().signIn('admin@example.com', function (e) {
      agent.get(`/admin/growers/${grower.id}/edit`)
      .expect(200)
      .end(t.end)
    })
  })
})

test('Adding and removing users', function (t) {
  var agent
  var grower
  var user

  Promise.all([
    models.Grower.findOne({
      include: {model: models.UserGrower, as: 'userGrowers'}
    }),
    models.User.findOne({})
  ]).then(function (results) {
    grower = results[0]
    user = results[1]
    t.ok(!grower.userGrowers.length)
    signIn()
  })

  function signIn () {
    agent = request().signIn('admin@example.com', function (e) {
      if (e) return t.end(e)
      addUser()
    })
  }

  function addUser () {
    agent.post(`/admin/growers/${grower.id}/adduser`)
    .field('user_id', user.id)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.UserGrower.findOne({
        where: {user_id: user.id, grower_id: grower.id}
      }).then(function (userGrower) {
        t.ok(!!userGrower)
        removeUser()
      })
    })
  }

  function removeUser () {
    agent.post(`/admin/growers/${grower.id}/removeuser`)
    .field('user_id', user.id)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.UserGrower.findOne({
        where: {user_id: user.id, grower_id: grower.id}
      }).then(function (userGrower) {
        t.ok(!userGrower)
        t.end()
      })
    })
  }

})
