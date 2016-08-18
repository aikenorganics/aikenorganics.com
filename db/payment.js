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

}

module.exports = Payment
