var Sql = require('sequelize')
var ozymandias = require('ozymandias')
var router = module.exports = ozymandias.Router()
var models = require('../../models')

router.get('/', function (req, res) {
  var where = {}
  var oversold = req.query.oversold

  if (oversold === '1') where.reserved = {gt: Sql.literal('supply')}

  models.Product.findAll({
    where: where,
    include: [{
      as: 'grower',
      model: models.Grower
    }]
  }).then(function (products) {
    res.render('admin/products/index', {products: products})
  })
})
