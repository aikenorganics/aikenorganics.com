'use strict'

let Model = require('./model')
let images = require('ozymandias/images')

class Product extends Model {

  static get tableName () {
    return 'products'
  }

  static get columns () {
    return [
      'id',
      'name',
      'cost',
      'supply',
      'unit',
      'description',
      'image_updated_at',
      'image_ext',
      'reserved',
      'active',
      'grower_id',
      'category_id',
      'created_at',
      'updated_at'
    ]
  }

  get name () {
    return this.data.get('name') || ''
  }

  set name (value) {
    this.data.set('name', value || '')
  }

  get cost () {
    return (this.data.get('cost') || '0').trim()
  }

  set cost (value) {
    this.data.set('cost', (value || '0').trim().replace(/^\$/, ''))
  }

  get unit () {
    return this.data.get('unit')
  }

  set unit (value) {
    this.data.set('unit', value || '')
  }

  get description () {
    return this.data.get('description')
  }

  set description (value) {
    this.data.set('description', value || '')
  }

  validate () {
    this.errors = {}

    if (!this.name) {
      this.errors.name = ['Name cannot be blank']
    }

    if (!/^\d*(\.\d\d)?$/.test((this.cost || '').trim())) {
      this.errors.cost = ['Cost must be a valid dollar amount']
    }

    if (this.supply < 0) {
      this.errors.supply = ['Supply cannot be negative']
    }
  }

  get available () {
    return Math.max(this.supply - this.reserved, 0)
  }

  isOversold () {
    return this.supply < this.reserved
  }

  reservedCost () {
    return +this.cost * this.reserved
  }

}

images.hasImage(Product, {
  name: 'image',
  sizes: {
    small: 100,
    medium: 250
  }
})

module.exports = Product
