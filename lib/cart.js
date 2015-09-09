'use strict'

class Cart {

  constructor (session) {
    if (!session.cart) session.cart = {}
    this.session = session
    this.cart = session.cart
  }

  ids () {
    return Object.keys(this.cart).map(function (id) { return +id })
  }

  clear () {
    this.cart = this.session.cart = {}
  }

  size () {
    var i = 0
    for (var id in this.cart) if (this.cart[id]) i += this.cart[id]
    return i
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
      return this.quantity(product) * +product.cost
    }

    return product.reduce(function (total, product) {
      return total + this.total(product)
    }.bind(this), 0)
  }
}

module.exports = Cart
