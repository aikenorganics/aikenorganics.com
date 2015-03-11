module.exports = function (req, res, next) {
  if (req.user && req.user.is_admin) return next()
  res.status(401).render('401')
}
