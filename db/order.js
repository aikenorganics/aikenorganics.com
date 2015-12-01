'use strict'

let Model = require('./model')

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

  total () {
    return this.productOrders.reduce(function (total, productOrder) {
      return total + productOrder.total()
    }, 0)
  }

}

module.exports = Order
