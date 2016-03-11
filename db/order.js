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
      'location_id',
      'notes',
      'status',
      'user_id',
      'created_at',
      'updated_at'
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
      if (!this.user.stripe_id) {
        return reject(new Error('User has no billing information.'))
      }
      stripe.charges.create({
        amount: amount,
        currency: 'usd',
        customer: this.user.stripe_id,
        description: `Aiken Organics - Order #${this.id}`,
        receipt_email: this.user.email,
        statement_descriptor: 'Aiken Organics'
      }, (e, charge) => e ? reject(e) : resolve(charge))
    }).then((charge) => {
      return Payment.create({
        amount: amount,
        stripe_id: charge.id,
        order_id: this.id
      })
    })
  }

  toJSON () {
    return {
      id: this.id,
      location_id: this.location_id,
      notes: this.notes,
      status: this.status,
      user_id: this.user_id,
      location: this.location,
      payments: this.payments,
      productOrders: this.productOrders,
      total: this.total
    }
  }

}

module.exports = Order
