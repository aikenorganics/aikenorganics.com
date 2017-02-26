'use strict'

const {Product} = require('../db')
const {get} = require('koa-route')

module.exports = [

  get('/market', async (_) => {
    const {newsHtml} = _.state.market
    const products = await Product.include('grower').join('grower')
    .where({active: true, featured: true, grower: {active: true}})
    .all()

    _.react({newsHtml, products})
  })

]
