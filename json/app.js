'use strict'

const userJson = require('./users/user')
const marketJson = require('./markets/market')

module.exports = (set, {req: {canEdit, cart, market, user}}) => {
  set({
    busy: false,
    canEdit: canEdit,
    cart: cart.cart
  })
  set('currentUser', user, userJson)
  set('market', market, marketJson)
}
