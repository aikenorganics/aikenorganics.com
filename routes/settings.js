'use strict'

const {all, get, post} = require('koa-route')

module.exports = [

  all('/settings', async (_, next) => {
    if (!_.state.currentUser) return _.unauthorized()
    await next()
  }, {end: false}),

  // Index
  get('/settings', async (_) => {
    _.react()
  }),

  // Update
  post('/settings', async (_) => {
    await _.state.currentUser.update(_.permit(
      'first', 'last', 'phone', 'street', 'city', 'state', 'zip'
    ))
    _.body = {user: _.state.currentUser}
  }),

  // Card
  post('/settings/card', async (_) => {
    const {token} = _.request.body
    await _.state.currentUser.updateCard(token)
    _.body = {user: _.state.currentUser}
  })

]
