'use strict'

let Model = require('./model')
let images = require('ozymandias/images')

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
      'image_updated_at',
      'image_ext',
      'description',
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

  get email () {
    return this.data.get('email') || ''
  }

  set email (value) {
    this.data.set('email', value || '')
  }

  get url () {
    let url = this.data.get('url')
    if (!/^https?:\/\//.test(url)) url = 'http://' + url
    return url
  }

  set url (value) {
    this.data.set('url', value || '')
  }

  get location () {
    return this.data.get('location') || ''
  }

  set location (value) {
    this.data.set('location', value || '')
  }

  get description () {
    return this.data.get('description') || ''
  }

  set description (value) {
    this.data.set('description', value || '')
  }

  toJSON () {
    return {
      id: this.id,
      url: this.url,
      name: this.name,
      email: this.email,
      active: this.active,
      location: this.location,
      image_updated_at: this.image_updated_at,
      image_ext: this.image_ext,
      description: this.description,
      smallImage: this.smallImage,
      mediumImage: this.mediumImage,
      products: this.products,
      total: this.total,
      userGrowers: this.userGrowers
    }
  }

}

images.hasImage(Grower, {
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

module.exports = Grower
