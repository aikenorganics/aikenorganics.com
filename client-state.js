'use strict'

module.exports = function *(next) {
  const {currentUser} = this.state

  Object.assign(this.state.client, {
    busy: false,
    currentUser,
    stripeKey: process.env.STRIPE_PK,
    bugsnag: {
      apiKey: 'fbe45b981d9d62f9c26e2ec78d469d17',
      releaseStage: process.env.NODE_ENV,
      notifyReleaseStages: ['production'],
      user: currentUser ? currentUser.slice('email', 'id', 'name') : {}
    }
  })

  yield next
}
