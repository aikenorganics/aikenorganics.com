#!/usr/bin/env node

var models = require('../models')

// Fixtures
var users = require('../fixtures/users')
var orders = require('../fixtures/orders')
var growers = require('../fixtures/growers')
var products = require('../fixtures/products')
var categories = require('../fixtures/categories')
var productOrders = require('../fixtures/product-orders')

Promise.all([

  // Users
  Promise.all(users.map(function (user) {
    return models.User.create(user)
  })),

  // Growers
  Promise.all(growers.map(function (grower) {
    return models.Grower.create(grower)
  })),

  // Categories
  Promise.all(categories.map(function (category) {
    return models.Category.create(category)
  }))

]).then(function () {
  return Promise.all([

    // Products
    Promise.all(products.map(function (product) {
      return models.Product.create(product)
    })),

    // Orders
    Promise.all(orders.map(function (order) {
      return models.Order.create(order)
    }))

  ]).then(function () {
    // Product Orders
    return Promise.all(productOrders.map(function (productOrder) {
      return models.ProductOrder.create(productOrder)
    }))
  })
})
.then(function () { models.sequelize.close() })
.catch(function (e) { console.log(e.stack) })
