'use strict'

const {Product} = require('../../db')
const {get} = require('koa-route')

module.exports = [

  get('/admin/products', function *() {
    const scope = Product.include('grower')

    // Oversold?
    const oversold = this.query.oversold === '1'
    if (oversold) scope.where('reserved > supply')

    // Search
    const {search} = this.query
    if (search) scope.search(search)

    // Pagination
    const page = +(this.query.page || 1)

    const products = yield scope.order('name').paginate(page, 100)

    this.react({
      more: products.more,
      oversold,
      page,
      products,
      search
    })
  })

]
