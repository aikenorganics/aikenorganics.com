module.exports = function (name, Model) {
  return function (req, res, next, id) {
    if (!id) return next()
    Model.find(id).then(function (model) {
      if (!model) return res.status(404).render('404')
      req[name] = res.locals[name] = model
      next()
    })
  }
}
