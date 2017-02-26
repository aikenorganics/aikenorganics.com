'use strict'

const {UserGrower} = require('../../db')
const {del, post} = require('koa-route')

module.exports = [

  // Create
  post('/admin/user-growers', async (_) => {
    const {userId, growerId} = _.request.body
    const {id} = await UserGrower.create({userId, growerId})
    _.body = {
      userGrower: await UserGrower.include('user', 'grower').find(id)
    }
  }),

  // Destroy
  del('/admin/user-growers/:id', async (_, id) => {
    const userGrower = await UserGrower.find(id)
    if (!userGrower) return _.notfound()
    await userGrower.destroy()
    _.body = {}
  })

]
