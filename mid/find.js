module.exports = function (Model, options) {
  if (!options) options = {}

  var name = options.name || Model.options.name.singular

  return function (req, res, next, id) {
    if (!id) return next()
    Model.find({
      where: {id: id},
      order: options.order,
      include: options.include
    }).then(function (model) {
      if (!model) return res.status(404).render('404')
      req[name] = res.locals[name] = model
      next()
    })
  }
}
