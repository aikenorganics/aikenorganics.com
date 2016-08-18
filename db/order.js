'use strict'

const Model = require('./model')
const Payment = require('./payment')
const stripe = require('stripe')(process.env.STRIPE_SK)

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
    return new Promise((resolve, reject) => {
      if (!this.user.stripeId) {
        return reject(new Error('User has no billing information.'))
      }
      stripe.charges.create({
        amount: amount,
        currency: 'usd',
        customer: this.user.stripeId,
        description: `Aiken Organics - Order #${this.id}`,
        receipt_email: this.user.email,
        statement_descriptor: 'Aiken Organics'
      }, (e, charge) => e ? reject(e) : resolve(charge))
    }).then((charge) => {
      return Payment.create({
        amount: amount,
        stripeId: charge.id,
        orderId: this.id
      })
    })
  }

}

module.exports = Order
