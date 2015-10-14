'use strict'

let Model = require('./model')

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
      'imaged_at',
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

}

module.exports = User
