var Sql = require('sequelize')
var express = require('express')
var router = module.exports = express.Router()
var models = require('../../models')

router.get('/oversold', function (req, res) {
  models.Product.findAll({
    where: {reserved: {gt: Sql.literal('supply')}},
    include: [{model: models.Grower, as: 'grower'}]
  }).then(function (products) {
    res.render('admin/products/oversold', {products: products})
  })
})
