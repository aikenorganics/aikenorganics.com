'use strict'

const Model = require('./model')

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

  toJSON () {
    return Object.assign(super.toJSON(), {
      location: this.location,
      productOrders: this.productOrders,
      total: this.total
    })
  }

}

module.exports = Order
