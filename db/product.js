'use strict'

const marked = require('marked')
const Model = require('./model')

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
      'imageUpdatedAt',
      'reserved',
      'active',
      'growerId',
      'categoryId',
      'createdAt',
      'updatedAt',
      'featured'
    ]
  }

  get name () {
    return this._name || ''
  }

  set name (value) {
    this._name = value || ''
  }

  get cost () {
    return (this._cost || '0').trim()
  }

  set cost (value) {
    this._cost = (value || '0').trim().replace(/^\$/, '')
  }

  get unit () {
    return this._unit
  }

  set unit (value) {
    this._unit = value || ''
  }

  get description () {
    return this._description
  }

  set description (value) {
    this._description = value || ''
  }

  get descriptionHtml () {
    return marked(this.description, {sanitize: true})
  }

  validate () {
    this.errors = {}

    if (!this.name) {
      this.errors.name = ['Name cannot be blank']
    }

    if (!/^\d*(\.\d\d)?$/.test((this.cost || '').trim())) {
      this.errors.cost = ['Cost must be a valid dollar amount']
    }

    if (this.supply === '' || isNaN(+this.supply)) {
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
    return this.slice(
      'id',
      'cost',
      'name',
      'supply',
      'unit',
      'reserved',
      'active',
      'growerId',
      'categoryId',
      'available',
      'oversold',
      'smallImage',
      'mediumImage',
      'featured',
      'category',
      'grower'
    )
  }

}

Product.hasImage({
  name: 'image',
  sizes: {
    small: 100,
    medium: 400
  },
  defaults: [
    'img/vegetables-square.jpg',
    'img/veggies-in-boxes-square.jpg',
    'img/food-basket-square.jpg',
    'img/pen-and-pad-square.jpg'
  ]
})

module.exports = Product

const Grower = require('./grower')
const Category = require('./category')
const ProductOrder = require('./product-order')

Product.belongsTo('grower', {key: 'growerId', model: Grower})
Product.belongsTo('category', {key: 'categoryId', model: Category})
Product.hasMany('productOrders', {key: 'productId', model: ProductOrder})
