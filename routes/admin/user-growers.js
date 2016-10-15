'use strict'

const {UserGrower} = require('../../db')
const {del, post} = require('koa-route')

module.exports = [

  // Create
  post('/admin/user-growers', function *() {
    const {userId, growerId} = this.request.body
    const {id} = yield UserGrower.create({userId, growerId})
    this.body = {
      userGrower: yield UserGrower.include('user', 'grower').find(id)
    }
  }),

  // Destroy
  del('/admin/user-growers/:id', function *(id) {
    const userGrower = yield UserGrower.find(id)
    if (!userGrower) return this.notfound()
    yield userGrower.destroy()
    this.body = {}
  })

]
