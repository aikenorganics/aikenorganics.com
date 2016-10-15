'use strict'

const {all, get, post} = require('koa-route')

module.exports = [

  all('/settings', function *(next) {
    if (!this.state.currentUser) return this.unauthorized()
    yield next
  }, {end: false}),

  // Index
  get('/settings', function *() { this.react() }),

  // Update
  post('/settings', function *() {
    yield this.state.currentUser.update(this.permit(
      'first', 'last', 'phone', 'street', 'city', 'state', 'zip'
    ))
    this.body = {user: this.state.currentUser}
  }),

  // Card
  post('/settings/card', function *() {
    const {token} = this.request.body
    yield this.state.currentUser.updateCard(token)
    this.body = {user: this.state.currentUser}
  })

]
