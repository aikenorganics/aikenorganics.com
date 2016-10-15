'use strict'

const Model = require('./model')
const stripe = require('stripe')(process.env.STRIPE_SK)

const createCharge = (options) => new Promise((resolve, reject) => {
  stripe.charges.create(options, (error, charge) => (
    error ? reject(error) : resolve(charge)
  ))
})

class Order extends Model {

  static get tableName () {
    return 'orders'
  }

  static get columns () {
    return [
      'id',
      'locationId',
      'notes',
      'status',
      'userId',
      'createdAt',
      'updatedAt'
    ]
  }

  get total () {
    if (!this.productOrders) return undefined
    return this.productOrders.reduce((total, productOrder) => {
      return total + productOrder.total
    }, 0)
  }

  charge (amount) {
    return User.find(this.userId).then((user) => {
      if (!user) throw new Error('Unable to find user.')
      if (!user.stripeId) throw new Error('User has no billing information.')

      return createCharge({
        amount: amount,
        currency: 'usd',
        customer: user.stripeId,
        description: `Aiken Organics - Order #${this.id}`,
        receipt_email: user.email,
        statement_descriptor: 'Aiken Organics'
      })
    }).then((charge) => {
      return Payment.create({
        amount: amount,
        stripeId: charge.id,
        orderId: this.id
      })
    })
  }

  toJSON () {
    return this.slice(
      'id',
      'locationId',
      'notes',
      'status',
      'userId',
      'total',
      'user',
      'location'
    )
  }

}

module.exports = Order

const User = require('./user')
const Payment = require('./payment')
const Location = require('./location')
const ProductOrder = require('./product-order')

Order.belongsTo('user', {key: 'userId', model: User})
Order.belongsTo('location', {key: 'locationId', model: Location})
Order.hasMany('payments', {key: 'orderId', model: Payment})
Order.hasMany('productOrders', {key: 'orderId', model: ProductOrder})
