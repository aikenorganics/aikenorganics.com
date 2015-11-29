'use strict'

class Cart {

  constructor (session) {
    this.session = session
    if (!session.cart) session.cart = {}
  }

  get cart () {
    return this.session.cart
  }

  get ids () {
    return Object.keys(this.cart).map(id => +id)
  }

  get size () {
    return this.ids.reduce((sum, id) => {
      return sum + (this.cart[id] || 0)
    }, 0)
  }

  clear () {
    this.session.cart = {}
  }

  update (product, quantity) {
    if (quantity) {
      this.cart[product.id] = quantity
    } else {
      delete this.cart[product.id]
    }
  }

  quantity (product) {
    return Math.min(this.cart[product.id] || 0, product.available())
  }

  total (product) {
    if (!Array.isArray(product)) {
      if (!product.active || !product.grower.active) return 0
      return this.quantity(product) * +product.cost
    }

    return product.reduce((total, product) => {
      return total + this.total(product)
    }, 0)
  }

  toJSON () {
    return this.cart
  }
}

module.exports = Cart
