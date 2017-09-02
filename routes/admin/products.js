'use strict'

const {Product} = require('../../db')
const {get} = require('koa-route')

module.exports = [

  get('/admin/products', async (_) => {
    const scope = Product.include('grower')

    // Oversold?
    const oversold = _.query.oversold === '1'
    if (oversold) scope.where('reserved > supply')

    // Search
    const {search} = _.query
    if (search) scope.search(search)

    // Pagination
    const page = +(_.query.page || 1)

    const products = await scope.order('name').paginate(page, 100)

    _.render({
      more: products.more,
      oversold,
      page,
      products,
      search
    })
  })

]
