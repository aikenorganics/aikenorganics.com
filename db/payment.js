'use strict'

const Model = require('./model')

class Payment extends Model {
  static get tableName () {
    return 'payments'
  }

  static get columns () {
    return [
      'id',
      'stripeId',
      'orderId',
      'amount'
    ]
  }

  toJSON () {
    return this.slice(
      'id',
      'stripeId',
      'orderId',
      'amount'
    )
  }
}

module.exports = Payment

const Order = require('./order')

Payment.belongsTo('order', {key: 'orderId', model: Order})
