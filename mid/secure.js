module.exports = function (req, res, next) {
  var protocol = req.headers['x-forwarded-proto']
  if (protocol !== 'https') {
    res.redirect(`https://${req.hostname}${req.originalUrl}`)
  }
}
