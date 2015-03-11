var express = require('express')
var router = module.exports = express.Router()

router.use(function (req, res, next) {
  if (!req.admin) return res.status(401).render('401')
  next()
})

router.use('/users', require('./users'))
router.use('/orders', require('./orders'))
router.use('/products', require('./products'))
router.use('/categories', require('./categories'))
