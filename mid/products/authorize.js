'use strict'

const db = require('../../db')

module.exports = (req, res, next) => {
  if (!req.currentUser || !req.product) return next()

  if (req.admin) {
    req.canEdit = res.locals.canEdit = true
    return next()
  }

  db.UserGrower.where({
    user_id: req.currentUser.id,
    grower_id: req.product.grower_id
  }).find().then((userGrower) => {
    req.canEdit = res.locals.canEdit = !!userGrower
    next()
  }).catch(res.error)
}
