'use strict'

let db = require('../../db')

module.exports = function (req, res, next) {
  if (!req.user || !req.product) return next()

  if (req.admin) {
    req.canEdit = res.locals.canEdit = true
    return next()
  }

  db.UserGrower.where({
    user_id: req.user.id,
    grower_id: req.product.grower_id
  }).find().then(function (userGrower) {
    req.canEdit = res.locals.canEdit = !!userGrower
    next()
  }).catch(res.error)
}
