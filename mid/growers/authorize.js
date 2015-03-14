var models = require('../../models')

module.exports = function (req, res, next) {
  if (!req.user || !req.grower && !req.product) return next()

  if (req.admin) {
    req.canEdit = res.locals.canEdit = true
    return next()
  }

  var grower_id = req.grower ? req.grower.id : req.product.grower_id

  models.UserGrower.findOne({
    where: {
      user_id: req.user.id,
      grower_id: grower_id
    }
  }).then(function (userGrower) {
    req.canEdit = res.locals.canEdit = !!userGrower
    next()
  })
}
