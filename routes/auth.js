'use strict'

let ozymandias = require('ozymandias')
let db = require('../db')

let router = module.exports = ozymandias.Router()

// Find Token
router.find('token', () => db.Token.include('user'))

// Find User
function findUser (req, res, next) {
  db.User.where('lower(email) = lower(?)', req.body.email).find()
  .then(function (user) {
    req.user = res.locals.user = user
    next()
  }).catch(res.error)
}

// Forgot
router.get('/forgot', (req, res) => res.render('auth/forgot'))

router.post('/forgot', findUser)
router.post('/forgot', function (req, res) {
  let expires_at = new Date()
  expires_at.setDate(expires_at.getDate() + 7)

  if (!req.user) {
    return res.status(404).render('auth/forgot', {
      error: 'Sorry! We don’t recognize that email.'
    })
  }

  db.transaction(function () {
    return db.Token.create({
      user_id: req.user.id,
      expires_at: expires_at
    })
  }).then(function (token) {
    return req.mail('mail/forgot', {
      to: [req.user.email],
      subject: `${process.env.NAME}: Password Reset`,
      url: `http://${req.get('host')}/auth/reset/${token.id}`
    })
  }).then(function () {
    res.flash('success', 'Thanks! We sent you an email to reset your password.')
    res.redirect('/auth/signin')
  }).catch(res.error)
})

// Reset
router.get('/reset/:token_id', function (req, res) {
  if (!req.token || req.token.expires_at < new Date()) {
    return res.status(404).render('auth/reset', {
      error: 'Sorry! That token is expired.'
    })
  }

  res.render('auth/reset')
})

router.post('/reset/:token_id', function (req, res) {
  if ((req.body.password || '').length < 8) {
    return res.status(422).render('auth/reset', {
      error: 'Sorry! Passwords must be at least eight characters long.'
    })
  }

  if (!req.token || req.token.expires_at < new Date()) {
    return res.status(404).render('auth/reset', {
      error: 'Sorry! That token is expired.'
    })
  }

  req.token.user.update(req.permit('password')).then(function () {
    res.flash('success', 'Password Changed')
    req.session.userId = req.token.user.id
    res.redirect('/')
  }).catch(res.error)
})

// Sign Out
router.get('/signout', function (req, res) {
  req.session = null
  res.redirect('/')
})

// Sign In
router.get('/signin', (req, res) => res.render('auth/signin'))

router.post('/signin', findUser)
router.post('/signin', function (req, res) {
  let password = (req.body.password || '').trim()

  if (!req.user) {
    return res.status(404).render('auth/signin', {
      error: 'Sorry! We don’t recognize that email.'
    })
  }

  // Is the password correct?
  req.user.authenticate(password).then((match) => {
    if (match) {
      req.session.userId = req.user.id
      res.redirect('/')
      return
    }

    res.status(422).render('auth/signin', {
      email: req.body.email,
      error: 'Sorry! That password is incorrect.'
    })
  }).catch(res.error)
})

// Sign Up
router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', findUser)
router.post('/signup', function (req, res) {
  // TODO: Trim this in the model.
  let email = (req.body.email || '').trim()
  // TODO: Don't trim at all.
  let password = (req.body.password || '').trim()

  // Validate the password.
  if (password.length < 8) {
    res.status(422).render('auth/signup', {
      email: email,
      error: 'Password must be at least eight characters long.'
    })
    return
  }

  // Validate the email.
  if (!/\S+@\S+\.\S+/.test(email)) {
    res.status(422).render('auth/signup', {
      error: 'Please enter a valid email address.'
    })
    return
  }

  // Does this user already exist?
  if (req.user) {
    res.status(422).render('auth/signup', {
      email: email,
      error: 'That user already exists! Is it you?'
    })
    return
  }

  let params = req.permit('first', 'last', 'phone', 'password')
  params.email = email

  db.User.create(params).then(function (user) {
    req.session.userId = user.id
    res.redirect('/')
  }).catch(res.error)
})
