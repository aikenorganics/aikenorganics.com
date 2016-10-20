'use strict'

const stripe = require('stripe')(process.env.STRIPE_SK)

class User extends require('ozymandias/user') {

  static get columns () {
    return super.columns.concat([
      'last',
      'first',
      'phone',
      'imageUpdatedAt',
      'memberUntil',
      'stripeId',
      'cardBrand',
      'cardLast4',
      'street',
      'city',
      'state',
      'zip'
    ])
  }

  get first () {
    return this._first || ''
  }

  set first (value) {
    this._first = value || ''
  }

  get last () {
    return this._last || ''
  }

  set last (value) {
    this._last = value || ''
  }

  get phone () {
    return this._phone || ''
  }

  set phone (value) {
    this._phone = value || ''
  }

  get name () {
    return `${this.first} ${this.last}`.trim()
  }

  get address () {
    if (!this.street || !this.city || !this.state || !this.zip) {
      return null
    }
    return `${this.street}, ${this.city} ${this.state} ${this.zip}`
  }

  get canDeliver () {
    return !!(
      this.phone &&
      this.street &&
      this.city &&
      this.state &&
      this.stripeId &&
      this.zip
    )
  }

  get memberUntil () {
    return this._memberUntil || null
  }

  set memberUntil (value) {
    this._memberUntil = value || null
  }

  get street () {
    return this._street
  }

  set street (value) {
    if (typeof value === 'string') value = value.trim()
    this._street = value
  }

  get city () {
    return this._city
  }

  set city (value) {
    if (typeof value === 'string') value = value.trim()
    this._city = value
  }

  get state () {
    return this._state
  }

  set state (value) {
    if (typeof value === 'string') value = value.trim().toUpperCase()
    this._state = value
  }

  get zip () {
    return this._zip
  }

  set zip (value) {
    if (typeof value === 'string') value = value.trim()
    this._zip = value
  }

  validate () {
    super.validate()

    if (this.street != null && !/\S+/.test(this.street)) {
      this.errors.street = ['Street cannot be blank']
    }

    if (this.city != null && !/\S+/.test(this.city)) {
      this.errors.city = ['City cannot be blank']
    }

    if (this.state != null && !/^[a-z]{2}$/i.test(this.state)) {
      this.errors.state = ['State must be two letters']
    }

    if (this.zip != null & !/^\d{5}(-\d{4})?$/.test(this.zip)) {
      this.errors.zip = ['Zip must be valid (12345 or 12345-1234)']
    }
  }

  createCustomer (token) {
    return new Promise((resolve, reject) => {
      stripe.customers.create({
        email: this.email,
        metadata: {id: this.id},
        source: token
      }, (error, customer) => error ? reject(error) : resolve(customer))
    })
  }

  updateCustomer (values) {
    return new Promise((resolve, reject) => {
      stripe.customers.update(this.stripeId, values, (error, customer) => {
        error ? reject(error) : resolve(customer)
      })
    })
  }

  updateCard (token) {
    const update = (customer) => {
      const card = customer.sources.data.find((source) => {
        return source.id === customer.default_source
      })
      return this.update({
        stripeId: customer.id,
        cardBrand: card.brand,
        cardLast4: card.last4
      })
    }
    if (this.stripeId) {
      return this.updateCustomer({source: token}).then(update)
    } else {
      return this.createCustomer(token).then(update)
    }
  }

  toJSON () {
    return this.slice(
      'id',
      'canDeliver',
      'email',
      'name',
      'last',
      'first',
      'phone',
      'isAdmin',
      'memberUntil',
      'stripeId',
      'cardBrand',
      'cardLast4',
      'street',
      'city',
      'state',
      'zip',
      'address',
      'hasOrder',
      'mediumImage'
    )
  }

}

User.hasImage({
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

module.exports = User

const Event = require('./event')
const Order = require('./order')
const UserGrower = require('./user-grower')

User.hasMany('events', {key: 'userId', model: Event})
User.hasMany('orders', {key: 'userId', model: Order})
User.hasMany('userGrowers', {key: 'userId', model: UserGrower})
