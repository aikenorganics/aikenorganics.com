'use strict'

const marked = require('marked')
const Model = require('./model')

class Grower extends Model {
  static get tableName () {
    return 'growers'
  }

  static get columns () {
    return [
      'id',
      'url',
      'name',
      'email',
      'active',
      'location',
      'imageUpdatedAt',
      'description',
      'createdAt',
      'updatedAt'
    ]
  }

  get name () {
    return this._name || ''
  }

  set name (value) {
    this._name = value || ''
  }

  get email () {
    return this._email || ''
  }

  set email (value) {
    this._email = value || ''
  }

  get url () {
    return this._url || ''
  }

  set url (value) {
    this._url = (value || '').trim()
  }

  get location () {
    return this._location || ''
  }

  set location (value) {
    this._location = value || ''
  }

  get description () {
    return this._description || ''
  }

  set description (value) {
    this._description = value || ''
  }

  get descriptionHtml () {
    return marked(this.description, {sanitize: true})
  }

  validate () {
    this.errors = {}

    if (this.url && !/^https?:\/\//.test(this.url)) {
      this.errors.url = ['URL must start with http(s)://']
    }
  }

  toJSON () {
    return this.slice(
      'id',
      'url',
      'name',
      'email',
      'total',
      'active',
      'location',
      'smallImage',
      'mediumImage',
      'userGrowers'
    )
  }
}

Grower.hasImage({
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

module.exports = Grower

const Event = require('./event')
const Product = require('./product')
const UserGrower = require('./user-grower')

Grower.hasMany('events', {key: 'growerId', model: Event})
Grower.hasMany('products', {key: 'growerId', model: Product})
Grower.hasMany('userGrowers', {key: 'growerId', model: UserGrower})
