'use strict'

let test = require('../../test')
let db = require('../../../db')

test('GET /admin/growers is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/admin/growers')
    .expect(200)
    .end(t.end)
  })
})

test('GET /admin/growers/:id/edit is a 200', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get(`/admin/growers/1/edit`)
    .expect(200)
    .end(t.end)
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
      db.transaction(function () {
        db.UserGrower.where({user_id: 2, grower_id: 1}).find()
        .then(function (userGrower) {
          t.ok(userGrower != null)
          t.end()
        })
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
      db.transaction(function () {
        db.UserGrower.where({user_id: 5, grower_id: 1}).find()
        .then(function (userGrower) {
          t.ok(userGrower == null)
          t.end()
        })
      })
    })
  })
})

test('POST /admin/growers/:id is a 302 when activating', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/growers/3')
    .field('active', 1)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.transaction(function () {
        db.Grower.find(3).then(function (grower) {
          t.ok(grower.active)
          t.end()
        })
      })
    })
  })
})

test('POST /admin/growers/:id is a 302 when deactivating', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .post('/admin/growers/1')
    .field('active', 0)
    .expect(302)
    .end(function (e) {
      if (e) return t.end(e)
      db.transaction(function () {
        db.Grower.find(1).then(function (grower) {
          t.ok(!grower.active)
          t.end()
        })
      })
    })
  })
})
