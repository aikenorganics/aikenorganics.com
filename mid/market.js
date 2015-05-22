var app = require('../app')
var models = require('../models')

module.exports = function (req, res, next) {
  models.Market.findOne({
    where: {domain: app.get('hostname') || req.hostname},
    transaction: req.transaction
  }).then(function (market) {
    if (!market) return res.status(404).render('404')
    req.market = res.locals.market = market
    req.open = res.locals.open = market.open
    next()
  })
}
