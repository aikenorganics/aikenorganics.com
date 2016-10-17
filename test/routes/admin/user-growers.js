'use strict'

const {UserGrower} = require('../../../db')
const test = require('../../test')

test('POST /admin/user-growers is a 200', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/admin/user-growers')
    .send({userId: 2, growerId: 1})
    .expect(200)
    .end((error) => {
      if (error) return t.end(error)
      UserGrower.where({userId: 2, growerId: 1}).find().then((userGrower) => {
        t.ok(userGrower)
        t.end()
      }).catch(t.end)
    })
  })
})

test('DELETE /admin/user-growers/missing is a 404', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent.delete('/admin/user-growers/12345').expect(404).end(t.end)
  })
})

test('DELETE /admin/user-growers/:userGrowerId is a 200', function *(t) {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .delete('/admin/user-growers/1')
    .expect(200)
    .end((error) => {
      if (error) return t.end(error)
      UserGrower.find(1).then((userGrower) => {
        t.ok(!userGrower)
        t.end()
      }).catch(t.end)
    })
  })
})
