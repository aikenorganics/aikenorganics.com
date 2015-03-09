#!/usr/bin/env node

var Sql = require('sequelize');
var models = require('../models');
var Product = models.Product;

Product.findAll().then(function(products) {
  Promise.all(products.map(function(product) {
    return product.update({
      reserved: Sql.literal('COALESCE((select sum(quantity) from product_orders where product_id = ' + product.id + '), 0)')
    });
  })).then(function() {
    models.sequelize.close();
  });
});
