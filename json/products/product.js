'use strict'

const growerJson = require('../growers/grower')
const categoryJson = require('../categories/category')

module.exports = (set, product) => {
  set(product,
    'id',
    'cost',
    'name',
    'supply',
    'unit',
    'reserved',
    'active',
    'growerId',
    'categoryId',
    'available',
    'oversold',
    'smallImage',
    'mediumImage',
    'featured'
  )

  if (product.category) {
    set('category', product.category, categoryJson)
  }

  if (product.grower) {
    set('grower', product.grower, growerJson)
  }
}
