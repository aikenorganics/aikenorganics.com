'use strict'

const userJson = require('./users/user')
const marketJson = require('./markets/market')

module.exports = (set, {canEdit, cart, currentUser, market}) => {
  const {email, id, name} = currentUser || {}

  set({
    busy: false,
    canEdit,
    cart: cart.cart,
    stripeKey: process.env.STRIPE_PK,
    bugsnag: {
      apiKey: 'fbe45b981d9d62f9c26e2ec78d469d17',
      releaseStage: process.env.NODE_ENV,
      notifyReleaseStages: ['production'],
      user: currentUser ? {email, id, name} : {}
    }
  })

  if (currentUser) set('currentUser', currentUser, userJson)
  if (market) set('market', market, marketJson)
}
