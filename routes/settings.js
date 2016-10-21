'use strict'

const {all, get, post} = require('koa-route')

module.exports = [

  all('/settings', function *(next) {
    if (!this.state.currentUser) return this.unauthorized()
    yield next
  }, {end: false}),

  // Index
  get('/settings', function *() {
    this.react()
    if (this.response.is('html')) {
      this.csp('img-src', 'https://q.stripe.com')
      this.csp('frame-src', 'https://checkout.stripe.com')
      this.csp('script-src', 'https://checkout.stripe.com')
      this.csp('connect-src', 'https://checkout.stripe.com')
    }
  }),

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
