'use strict'

const marked = require('marked')
const Model = require('./model')
const images = require('ozymandias/images')

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

  get descriptionHtml () {
    return marked(this.description, {sanitize: true})
  }

}

images.hasImage(Grower, {
  name: 'image',
  sizes: {
    small: 100,
    medium: 300
  },
  defaults: [
    'img/vegetables-square.jpg',
    'img/veggies-in-boxes-square.jpg',
    'img/food-basket-square.jpg',
    'img/pen-and-pad-square.jpg'
  ]
})

module.exports = Grower
