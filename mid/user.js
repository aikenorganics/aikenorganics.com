var User = require('../models').User

module.exports = function (req, res, next) {
  var id = req.session.userId
  if (!id) return next()
  User.find(id).then(function (user) {
    if (!user) return next()
    req.user = res.locals.user = user
    req.admin = res.locals.admin = user.is_admin
    next()
  })
}
