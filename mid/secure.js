module.exports = function (req, res, next) {
  var protocol = req.headers['x-forwarded-proto']
  if (protocol === 'https') return next()
  res.redirect(`https://${req.hostname}${req.originalUrl}`)
}
