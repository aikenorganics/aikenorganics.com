'use strict'

module.exports = function (property, scope) {
  return function (req, res, next, id) {
    if (!id) return next()
    scope().find(id).then(function (model) {
      if (!model) return res.status(404).render('404')
      req[property] = res.locals[property] = model
      next()
    }).catch(next)
  }
}