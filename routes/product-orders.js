'use strict'

const {ProductOrder} = require('../db')
const {del} = require('koa-route')

module.exports = [

  // Delete
  del('/product-orders/:id', async (_, id) => {
    const {admin, currentUser, open} = _.state

    if (!currentUser) return _.unauthorized()

    let scope = ProductOrder.join('order').include('order')

    if (!admin) {
      if (!open) return _.unauthorized()
      scope = scope.where({order: {userId: currentUser.id}})
    }

    const productOrder = await scope.find(id)
    if (!productOrder) return _.notfound()

    await productOrder.destroy()
    _.body = {}
  })

]
