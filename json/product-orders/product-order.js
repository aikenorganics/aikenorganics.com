'use strict'

const productJson = require('../products/product')

module.exports = (set, productOrder) => {
  set(productOrder,
    'id',
    'cost',
    'orderId',
    'productId',
    'quantity',
    'total'
  )

  if (productOrder.product) {
    set('product', productOrder.product, productJson)
  }
}
