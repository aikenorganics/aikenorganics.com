'use strict'

const userJson = require('./users/user')
const marketJson = require('./markets/market')

module.exports = (set, {req: {canEdit, cart, market, user}}) => {
  set({
    busy: false,
    canEdit: canEdit,
    cart: cart.cart
  })
  if (user) set('currentUser', user, userJson)
  if (market) set('market', market, marketJson)
}
