var app = require('../app')
var models = require('../models')

module.exports = function(req, res, next) {
  req.transaction = function(next) {
    var transaction = app.get('transaction')

    // If this isn't a test, delegate to sequelize
    if (!transaction) return models.sequelize.transaction(next)

    // Ensure a promise is returned.
    var promise = next(transaction)
    if (!promise || !promise.then) {
      throw new Error('Must return a promise to req.transaction.')
    }
  }
  next()
}
