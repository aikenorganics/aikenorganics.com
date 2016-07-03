'use strict'

const db = require('../db')
const json = require('../json/cart/index')
const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.user && req.market.open) return next()
  res.status(401).format({
    html: () => { res.render('401') },
    json: () => { res.json({message: 'Access Denied'}) }
  })
})

// Index
router.get('/', (req, res) => {
  Promise.all([
    db.Product
      .include('category', 'grower')
      .where({id: req.cart.ids})
      .order('name').all(),
    db.Location.where({active: true}).order('name').all(),
    db.Order.where({status: 'open', user_id: req.user.id}).find()
  ]).then(([products, locations, order]) => {
    res._react(json.index, {products, locations, order})
  }).catch(res.error)
})

// Update
router.post('/', (req, res, next) => {
  const id = req.body.product_id

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
    req.user.id,
    req.body.location_id,
    req.cart.ids.map((id) => [id, req.cart.cart[id]])
  ]).then(() => {
    return req.mail('mail/orders/update', {
      to: [req.user.email],
      subject: 'Aiken Organics: Order Updated',
      url: `http://${req.get('host')}/orders/current`
    })
  }).then(() => {
    req.cart.clear()
    res.json({})
  }).catch(res.error)
})
