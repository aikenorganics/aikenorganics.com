'use strict'

const db = require('../db')
const json = require('../json/cart/index')
const updateMail = require('../mail/orders/update')
const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.currentUser && req.market.open) return next()
  res.unauthorized()
})

// Index
router.get('/', (req, res) => {
  Promise.all([
    db.Product
      .include('category', 'grower')
      .where({id: req.cart.ids})
      .order('name').all(),
    db.Location.where({active: true}).order('name').all(),
    db.Order.where({status: 'open', userId: req.currentUser.id}).find()
  ]).then(([products, locations, order]) => {
    res.react(json.index, {products, locations, order})
  }).catch(res.error)
})

// Update
router.post('/', (req, res, next) => {
  const id = req.body.productId

  db.Product.include('grower').find(id).then((product) => {
    if (product && product.grower.active) {
      req.product = res.locals.product = product
      return next()
    }
    res.json({message: 'That product is unavailable'})
  }).catch(res.error)
})

router.post('/', (req, res) => {
  const quantity = +req.body.quantity
  req.cart.update(req.product, quantity)
  res.json({message: 'Cart updated.'})
})

// Checkout
router.post('/checkout', (req, res) => {
  db.query('select checkout($1, $2, $3)', [
    req.currentUser.id,
    req.body.locationId,
    req.cart.ids.map((id) => [id, req.cart.cart[id]])
  ]).then(() => (
    req.mail(updateMail, {
      to: [req.currentUser.email],
      subject: 'Aiken Organics: Order Updated',
      url: `http://${req.get('host')}/orders/current`
    })
  )).then(() => {
    req.cart.clear()
    res.json({})
  }).catch(res.error)
})
