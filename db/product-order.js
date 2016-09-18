'use strict'

const Model = require('./model')

class ProductOrder extends Model {

  static get tableName () {
    return 'product_orders'
  }

  static get columns () {
    return [
      'id',
      'cost',
      'orderId',
      'productId',
      'quantity',
      'createdAt',
      'updatedAt'
    ]
  }

  get cost () {
    return this._cost || '0'
  }

  set cost (value) {
    this._cost = (value || '0').trim().replace(/^\$/, '')
  }

  get quantity () {
    return this._quantity || 0
  }

  set quantity (value) {
    this._quantity = value || 0
  }

  validate () {
    this.errors = {}

    if (!/^\d*(\.\d\d)?$/.test((this.cost || '').trim())) {
      this.errors.cost = ['Cost must be a valid dollar amount']
    }
  }

  get total () {
    return +this.cost * this.quantity
  }

}

module.exports = ProductOrder

const Order = require('./order')
const Product = require('./product')

ProductOrder.belongsTo('order', {key: 'orderId', model: Order})
ProductOrder.belongsTo('product', {key: 'productId', model: Product})
