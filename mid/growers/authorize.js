var models = require('../../models')

module.exports = function (req, res, next) {
  if (!req.user || !req.grower) return next()

  if (req.admin) {
    req.canEdit = res.locals.canEdit = true
    return next()
  }

  models.UserGrower.findOne({
    where: {
      user_id: req.user.id,
      grower_id: req.grower.id
    }
  }).then(function (userGrower) {
    req.canEdit = res.locals.canEdit = !!userGrower
    next()
  })
}
