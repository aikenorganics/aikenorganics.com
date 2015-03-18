var test = require('../../test')
var models = require('../../../models')

test('GET /admin/growers is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/growers')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/growers/:id/edit is a 200', function (t) {
  models.Grower.findOne({}).then(function (grower) {
    t.signIn('admin@example.com').then(function (agent) {
      agent.get(`/admin/growers/${grower.id}/edit`)
      .expect(200)
      .end(t.end)
    })
  })
})

test('POST /admin/growers/:id/adduser is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/growers/1/adduser')
    .field('user_id', 2)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.UserGrower.findOne({
        where: {
          user_id: 2,
          grower_id: 1
        },
        transaction: t.transaction
      }).then(function (userGrower) {
        t.ok(userGrower != null)
        t.end()
      })
    })
  })
})

test('POST /admin/growers/:id/removeuser is a 302', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/growers/1/removeuser')
    .field('user_id', 5)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      models.UserGrower.findOne({
        where: {
          user_id: 5,
          grower_id: 1
        },
        transaction: t.transaction
      }).then(function (userGrower) {
        t.ok(userGrower == null)
        t.end()
      })
    })
  })
})
