'use strict'

let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

router.use(function (req, res, next) {
  if (!req.admin) return res.status(401).render('401')
  next()
})

router.use('/users', require('./users'))
router.use('/orders', require('./orders'))
router.use('/market', require('./market'))
router.use('/growers', require('./growers'))
router.use('/products', require('./products'))
router.use('/locations', require('./locations'))
router.use('/categories', require('./categories'))
router.use('/user-growers', require('./user-growers'))
router.use('/product-orders', require('./product-orders'))
