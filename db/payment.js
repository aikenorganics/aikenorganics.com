'use strict'

const Model = require('./model')

class Payment extends Model {

  static get tableName () {
    return 'payments'
  }

  static get columns () {
    return [
      'id',
      'stripe_id',
      'order_id',
      'amount'
    ]
  }

}

module.exports = Payment
