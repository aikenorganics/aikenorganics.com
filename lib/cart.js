var Cart = module.exports = function (session) {
  if (!session.cart) session.cart = {}
  this.session = session
  this.cart = session.cart
}

Cart.prototype.ids = function () {
  return Object.keys(this.cart).map(function (id) { return +id })
}

Cart.prototype.clear = function () {
  this.cart = this.session.cart = {}
}

Cart.prototype.size = function () {
  var i = 0
  for (var id in this.cart) if (this.cart[id]) i += this.cart[id]
  return i
}

Cart.prototype.update = function (product, quantity) {
  if (quantity) {
    this.cart[product.id] = quantity
  } else {
    delete this.cart[product.id]
  }
}

Cart.prototype.quantity = function (product) {
  return Math.min(this.cart[product.id] || 0, product.available())
}

Cart.prototype.total = function (product) {
  if (!Array.isArray(product)) {
    return this.quantity(product) * +product.cost
  }

  return product.reduce(function (total, product) {
    return total + this.total(product)
  }.bind(this), 0)
}
