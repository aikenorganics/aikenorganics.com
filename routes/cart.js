'use strict'

const db = require('../db')
const ozymandias = require('ozymandias')
const router = module.exports = ozymandias.Router()

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
    db.Product.include('grower').where({id: req.cart.ids}).order('name').all(),
    db.Location.where({active: true}).order('name').all(),
    db.Order.where({status: 'open', user_id: req.user.id}).find()
  ]).then((results) => {
    res.render('cart/index', {
      products: results[0],
      locations: results[1],
      order: results[2],
      unavailable: results[0].filter((product) => {
        return !product.active || !product.grower.active ||
          product.available < req.cart.cart[product.id]
      })
    })
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
    res.format({
      html: () => {
        res.flash('error', 'That product is unavailable')
        res.redirect(req.body.return_to || `/products/${id}`)
      },
      json: () => {
        res.json({message: 'That product is unavailable'})
      }
    })
  }).catch(res.error)
})

router.post('/', (req, res) => {
  const quantity = +req.body.quantity
  req.cart.update(req.product, quantity)

  res.format({
    html: () => {
      res.redirect(req.body.return_to || `/products/${req.product.id}`)
    },
    json: () => {
      res.json({
        cartSize: req.cart.size,
        product_id: req.product.id,
        quantity: Math.min(quantity, req.product.available),
        available: req.product.available,
        message: 'Cart updated.'
      })
    }
  })
})

// Checkout
router.post('/checkout', (req, res) => {
  db.query('select checkout($1, $2, $3)', [
    req.user.id,
    req.body.location_id,
    req.cart.ids.map((id) => {
      return [id, req.cart.cart[id]]
    })
  ]).then(() => {
    return req.mail('mail/orders/update', {
      to: [req.user.email],
      subject: 'Aiken Organics: Order Updated',
      url: `http://${req.get('host')}/orders/current`
    })
  }).then(() => {
    req.cart.clear()
    res.redirect('/orders/current')
  }).catch(res.error)
})
