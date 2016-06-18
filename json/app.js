'use strict'

const userJson = require('./users/user')
const marketJson = require('./markets/market')

module.exports = (json, {req: {canEdit, cart, market, user}}) => {
  json.set({
    busy: false,
    canEdit: canEdit,
    cart: cart.cart
  })
  json.set('currentUser', user, userJson)
  json.set('market', market, marketJson)
}
