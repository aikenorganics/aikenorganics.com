'use strict'

const images = require('ozymandias/images')

class User extends require('ozymandias/user') {

  static get tableName () {
    return 'users'
  }

  static get columns () {
    return super.columns.concat([
      'last',
      'first',
      'phone',
      'is_admin',
      'image_updated_at',
      'image_ext',
      'member_until'
    ])
  }

  get is_admin () {
    return !!+this.data.get('is_admin') || false
  }

  set is_admin (value) {
    this.data.set('is_admin', !!+value || false)
  }

  get first () {
    return this.data.get('first') || ''
  }

  set first (value) {
    this.data.set('first', value || '')
  }

  get last () {
    return this.data.get('last') || ''
  }

  set last (value) {
    this.data.set('last', value || '')
  }

  get phone () {
    return this.data.get('phone') || ''
  }

  set phone (value) {
    this.data.set('phone', value || '')
  }

  name () {
    return `${this.first} ${this.last}`.trim()
  }

  get member_until () {
    return this.data.get('member_until') || null
  }

  set member_until (value) {
    this.data.set('member_until', value || null)
  }

  toJSON () {
    return Object.assign(super.toJSON(), {
      has_order: this.has_order,
      mediumImage: this.mediumImage
    })
  }

}

images.hasImage(User, {
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

module.exports = User
