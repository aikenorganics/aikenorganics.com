'use strict'

let Model = require('./model')

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
      'imaged_at',
      'image_ext',
      'description',
      {name: 'created_at', property: 'createdAt'},
      {name: 'updated_at', property: 'updatedAt'}
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

}

module.exports = Grower
