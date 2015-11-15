'use strict'

let Model = require('./model')
let images = require('ozymandias/images')

class User extends Model {

  static get tableName () {
    return 'users'
  }

  static get columns () {
    return [
      'id',
      'last',
      'email',
      'first',
      'phone',
      'is_admin',
      'password',
      'image_updated_at',
      'image_ext',
      'member_until',
      {name: 'created_at', property: 'createdAt'},
      {name: 'updated_at', property: 'updatedAt'}
    ]
  }

  get email () {
    return this.data.get('email') || ''
  }

  set email (value) {
    this.data.set('email', value || '')
  }

  get is_admin () {
    return this.data.get('is_admin') || false
  }

  set is_admin (value) {
    this.data.set('is_admin', value || false)
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

}

images.hasImage(User, {
  name: 'image',
  sizes: {
    small: 100,
    medium: 250
  }
})

module.exports = User
