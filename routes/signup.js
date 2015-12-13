'use strict'

let router = module.exports = require('ozymandias').Router()
let db = require('../db')

router.get('/', (req, res) => res.render('signup/index'))

// Validations
router.post('/', (req, res, next) => {
  if (!/\S+@\S+\.\S+/.test(req.body.email)) {
    res.status(422).render('signup/index', {
      error: 'Please enter a valid email address.'
    })
    return
  }

  // Validate the password.
  if (!/[\s\S]{8,}/.test(req.body.password)) {
    res.status(422).render('signup/index', {
      email: req.body.email,
      error: 'Password must be at least eight characters long.'
    })
    return
  }

  db.User.where('trim(lower(email)) = trim(lower(?))', req.body.email).find()
  .then((user) => {
    if (!user) return next()
    res.status(422).render('signup/index', {
      email: req.body.email,
      error: 'That user already exists! Is it you?'
    })
  }).catch(res.error)
})

router.post('/', (req, res) => {
  db.User.create(req.permit(
    'first', 'last', 'phone', 'password', 'email'
  )).then((user) => {
    req.signIn(user)
    res.redirect('/')
  }).catch(res.error)
})
