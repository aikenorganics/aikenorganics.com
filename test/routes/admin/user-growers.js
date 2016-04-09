'use strict'

const db = require('../../../db')
const test = require('../../test')

test('POST /admin/user-growers is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/user-growers')
    .send({user_id: 2, grower_id: 1})
    .expect(200)
    .end((e) => {
      if (e) return t.end(e)
      db.UserGrower.where({user_id: 2, grower_id: 1}).find().then((userGrower) => {
        t.ok(userGrower)
        t.end()
      }).catch(t.end)
    })
  })
})

test('DELETE /admin/user-growers/:user_grower_id is a 200', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .delete('/admin/user-growers/1')
    .expect(200)
    .end((e) => {
      if (e) return t.end(e)
      db.UserGrower.find(1).then((userGrower) => {
        t.ok(!userGrower)
        t.end()
      }).catch(t.end)
    })
  })
})
