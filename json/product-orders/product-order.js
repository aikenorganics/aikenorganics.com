'use strict'

const productJson = require('../products/product')

module.exports = (set, productOrder) => {
  set(productOrder,
    'id',
    'cost',
    'order_id',
    'product_id',
    'quantity',
    'total'
  )

  if (productOrder.product) {
    set('product', productOrder.product, productJson)
  }
}
