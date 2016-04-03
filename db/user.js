'use strict'

const images = require('ozymandias/images')
const stripe = require('stripe')(process.env.STRIPE_SK)

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
      'member_until',
      'stripe_id',
      'card_brand',
      'card_last4',
      'street',
      'city',
      'state',
      'zip'
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

  get name () {
    return `${this.first} ${this.last}`.trim()
  }

  get address () {
    return `${this.street}, ${this.city} ${this.state} ${this.zip}`
  }

  get canDeliver () {
    return (
      this.phone &&
      this.street &&
      this.city &&
      this.state &&
      this.stripe_id &&
      this.zip
    )
  }

  get member_until () {
    return this.data.get('member_until') || null
  }

  set member_until (value) {
    this.data.set('member_until', value || null)
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
    this.errors = {}

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
      }, (e, customer) => e ? reject(e) : resolve(customer))
    })
  }

  updateCustomer (values) {
    return new Promise((resolve, reject) => {
      stripe.customers.update(this.stripe_id, values, (e, customer) => {
        e ? reject(e) : resolve(customer)
      })
    })
  }

  updateCard (token) {
    const update = (customer) => {
      const card = customer.sources.data.find((source) => {
        return source.id === customer.default_source
      })
      return this.update({
        stripe_id: customer.id,
        card_brand: card.brand,
        card_last4: card.last4
      })
    }
    if (this.stripe_id) {
      return this.updateCustomer({source: token}).then(update)
    } else {
      return this.createCustomer(token).then(update)
    }
  }

  toJSON () {
    return {
      id: this.id,
      canDeliver: this.canDeliver,
      email: this.email,
      name: this.name,
      last: this.last,
      first: this.first,
      phone: this.phone,
      is_admin: this.is_admin,
      image_updated_at: this.image_updated_at,
      image_ext: this.image_ext,
      member_until: this.member_until,
      stripe_id: this.stripe_id,
      card_brand: this.card_brand,
      card_last4: this.card_last4,
      street: this.street,
      city: this.city,
      state: this.state,
      zip: this.zip,
      address: this.address,
      has_order: this.has_order,
      mediumImage: this.mediumImage
    }
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
