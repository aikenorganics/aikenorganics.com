'use strict'

const {UserGrower} = require('../../../db')
const test = require('../../test')

test('POST /admin/user-growers is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client
    .post('/admin/user-growers')
    .send({userId: 2, growerId: 1})
  response.assert(200)
  const userGrower = await UserGrower.where({userId: 2, growerId: 1}).find()
  assert.ok(userGrower)
})

test('DELETE /admin/user-growers/missing is a 404', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.delete('/admin/user-growers/12345').send()
  response.assert(404)
})

test('DELETE /admin/user-growers/:userGrowerId is a 200', async (assert) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.delete('/admin/user-growers/1').send()
  response.assert(200)
  const userGrower = await UserGrower.find(1)
  assert.ok(!userGrower)
})
