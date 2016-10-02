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
    let url = this._url
    if (!/^https?:\/\//.test(url)) url = 'http://' + url
    return url
  }

  set url (value) {
    this._url = value || ''
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

const Product = require('./product')
const UserGrower = require('./user-grower')

Grower.hasMany('products', {key: 'growerId', model: Product})
Grower.hasMany('userGrowers', {key: 'growerId', model: UserGrower})
