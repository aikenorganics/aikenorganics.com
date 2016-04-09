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

    if (isNaN(+this.supply)) {
      this.errors.supply = ['Supply must be a number']
    } else if (this.supply < 0) {
      this.errors.supply = ['Supply cannot be negative']
    }
  }

  get available () {
    return Math.max(this.supply - this.reserved, 0)
  }

  get oversold () {
    return this.supply < this.reserved
  }

  reservedCost () {
    return +this.cost * this.reserved
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      cost: this.cost,
      supply: this.supply,
      unit: this.unit,
      description: this.description,
      image_updated_at: this.image_updated_at,
      image_ext: this.image_ext,
      reserved: this.reserved,
      active: this.active,
      grower_id: this.grower_id,
      category_id: this.category_id,
      available: this.available,
      oversold: this.oversold,
      category: this.category,
      grower: this.grower,
      smallImage: this.smallImage,
      mediumImage: this.mediumImage,

      // From query…
      quantity: this.quantity,
      total: this.total
    }
  }

}

images.hasImage(Product, {
  name: 'image',
  sizes: {
    small: 100,
    medium: 250
  },
  defaults: [
    'img/vegetables-square.jpg',
    'img/veggies-in-boxes-square.jpg',
    'img/food-basket-square.jpg',
    'img/pen-and-pad-square.jpg'
  ]
})

module.exports = Product
