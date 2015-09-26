'use strict'

let db = require('../db')

module.exports = function (req, res, next) {
  let id = req.session.userId
  if (!id) return next()
  db.User.find(id).then(function (user) {
    if (!user) return next()
    req.user = res.locals.user = user
    req.admin = res.locals.admin = user.is_admin
    next()
  }).catch(res.error)
}
