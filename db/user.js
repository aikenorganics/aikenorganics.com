'use strict'

const images = require('ozymandias/images')
const stripe = require('stripe')(process.env.STRIPE_SK)

class User extends require('ozymandias/user') {

  static get columns () {
    return super.columns.concat([
      'last',
      'first',
      'phone',
      'isAdmin',
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

  get isAdmin () {
    return !!+this.data.get('isAdmin') || false
  }

  set isAdmin (value) {
    this.data.set('isAdmin', !!+value || false)
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
    return this.data.get('memberUntil') || null
  }

  set memberUntil (value) {
    this.data.set('memberUntil', value || null)
  }

  get street () {
    return this.data.get('street')
  }

  set street (value) {
    if (typeof value === 'string') value = value.trim()
    this.data.set('street', value)
  }

  get city () {
    return this.data.get('city')
  }

  set city (value) {
    if (typeof value === 'string') value = value.trim()
    this.data.set('city', value)
  }

  get state () {
    return this.data.get('state')
  }

  set state (value) {
    if (typeof value === 'string') value = value.trim().toUpperCase()
    this.data.set('state', value)
  }

  get zip () {
    return this.data.get('zip')
  }

  set zip (value) {
    if (typeof value === 'string') value = value.trim()
    this.data.set('zip', value)
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

}

images.hasImage(User, {
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
