'use strict'

const {Product} = require('../db')
const {get} = require('koa-route')

module.exports = [

  get('/market', function *() {
    const {newsHtml} = this.state.market
    const products = yield Product.include('grower').join('grower')
    .where({active: true, featured: true, grower: {active: true}})
    .all()

    this.react({newsHtml, products})
  })

]
