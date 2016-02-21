'use strict'

let Model = require('./model')

class ProductOrder extends Model {

  static get tableName () {
    return 'product_orders'
  }

  static get columns () {
    return [
      'id',
      'cost',
      'order_id',
      'product_id',
      'quantity',
      'created_at',
      'updated_at'
    ]
  }

  get cost () {
    return this.data.get('cost') || '0'
  }

  set cost (value) {
    this.data.set('cost', (value || '0').trim().replace(/^\$/, ''))
  }

  get quantity () {
    return this.data.get('quantity') || 0
  }

  set quantity (value) {
    this.data.set('quantity', value || 0)
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

  toJSON () {
    return Object.extend(super.toJSON(), {
      total: this.total
    })
  }

}

module.exports = ProductOrder
