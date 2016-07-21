'use strict'

const userJson = require('./users/user')
const marketJson = require('./markets/market')

module.exports = (set, {req: {canEdit, cart, market, user}}) => {
  set({
    busy: false,
    canEdit: canEdit,
    cart: cart.cart,
    stripeKey: process.env.STRIPE_PK,
    bugsnag: {
      apiKey: 'fbe45b981d9d62f9c26e2ec78d469d17',
      releaseStage: process.env.NODE_ENV,
      notifyReleaseStages: ['production'],
      user: user ? {id: user.id, name: user.name, email: user.email} : {}
    }
  })
  if (user) set('currentUser', user, userJson)
  if (market) set('market', market, marketJson)
}
