'use strict'

const ozymandias = require('ozymandias')
const router = module.exports = ozymandias.Router()

router.use((req, res, next) => {
  if (!req.admin) return res.unauthorized()
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
