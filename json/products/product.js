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
    'image_updated_at',
    'image_ext',
    'reserved',
    'active',
    'grower_id',
    'category_id',
    'available',
    'oversold',
    'smallImage',
    'mediumImage'
  )

  if (product.category) {
    set('category', product.category, categoryJson)
  }

  if (product.grower) {
    set('grower', product.grower, growerJson)
  }
}
