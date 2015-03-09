module.exports = function(req, res, next) {
  var cart = req.session.cart || (req.session.cart = {});

  req.cart = res.locals.cart = {

    ids: function() {
      return Object.keys(cart);
    },

    clear: function() {
      req.session.cart = {};
    },

    size: function() {
      var i = 0;
      for (var id in cart) if (cart[id]) i += cart[id];
      return i;
    },

    update: function(product, quantity) {
      if (quantity) {
        cart[product.id] = quantity;
      } else {
        delete cart[product.id];
      }
    },

    quantity: function(product) {
      return Math.min(cart[product.id] || 0, product.available());
    },

    total: function(product) {
      if (!Array.isArray(product)) {
        return this.quantity(product) * +product.cost;
      }

      return product.reduce(function(total, product) {
        return total + this.total(product);
      }.bind(this), 0);
    }

  };

  next();
};
