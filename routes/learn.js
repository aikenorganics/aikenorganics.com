'use strict'

const {Location} = require('../db')
const {get} = require('koa-route')

module.exports = [

  get('/learn', async (_) => {
    const locations = await Location.where({active: true}).all()

    _.render({locations})
  })

]
