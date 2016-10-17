'use strict'

const {UserGrower} = require('../../../db')
const test = require('../../test')

test('POST /admin/user-growers is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client
    .post('/admin/user-growers')
    .send({userId: 2, growerId: 1})
  response.expect(200)
  const userGrower = yield UserGrower.where({userId: 2, growerId: 1}).find()
  t.ok(userGrower)
})

test('DELETE /admin/user-growers/missing is a 404', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.delete('/admin/user-growers/12345').send()
  response.expect(404)
})

test('DELETE /admin/user-growers/:userGrowerId is a 200', function *(t) {
  yield t.signIn('admin@example.com')
  const response = yield t.client.delete('/admin/user-growers/1').send()
  response.expect(200)
  const userGrower = yield UserGrower.find(1)
  t.ok(!userGrower)
})
