'use strict'

const {Product} = require('../db')
const json = require('../json/market')
const router = module.exports = require('ozymandias').Router()

router.get('/', (request, response) => {
  Product
  .include('grower')
  .join('grower')
  .where({active: true, featured: true, grower: {active: true}})
  .all().then((products) => {
    response.react(json.index, {products})
  }).catch(response.error)
})
