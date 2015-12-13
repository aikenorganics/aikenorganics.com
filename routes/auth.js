'use strict'

const router = module.exports = require('ozymandias').Router()
const db = require('../db')

// Find Token
router.find('token', () => db.Token.include('user'))

// Find User
function findUser (req, res, next) {
  db.User.where('lower(email) = lower(?)', req.body.email).find()
  .then((user) => {
    req.user = res.locals.user = user
    next()
  }).catch(res.error)
}

// Forgot
router.get('/forgot', (req, res) => res.render('auth/forgot'))

router.post('/forgot', findUser)
router.post('/forgot', (req, res) => {
  let expires_at = new Date()
  expires_at.setDate(expires_at.getDate() + 7)

  if (!req.user) {
    return res.status(404).render('auth/forgot', {
      error: 'Sorry! We don’t recognize that email.'
    })
  }

  db.Token.create({
    user_id: req.user.id,
    expires_at: expires_at
  }).then((token) => {
    return req.mail('mail/forgot', {
      to: [req.user.email],
      subject: `${process.env.NAME}: Password Reset`,
      url: `http://${req.get('host')}/auth/reset/${token.id}`
    })
  }).then(() => {
    res.flash('success', 'Thanks! We sent you an email to reset your password.')
    res.redirect('/auth/signin')
  }).catch(res.error)
})

// Reset
router.get('/reset/:token_id', (req, res) => {
  if (!req.token || req.token.expires_at < new Date()) {
    return res.status(404).render('auth/reset', {
      error: 'Sorry! That token is expired.'
    })
  }

  res.render('auth/reset')
})

router.post('/reset/:token_id', (req, res) => {
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

  req.token.user.update(req.permit('password')).then(() => {
    res.flash('success', 'Password Changed')
    req.signIn(req.token.user)
    res.redirect('/')
  }).catch(res.error)
})

// Sign Out
router.get('/signout', (req, res) => {
  req.signOut()
  res.redirect('/')
})

// Sign In
router.get('/signin', (req, res) => res.render('auth/signin'))

router.post('/signin', findUser)
router.post('/signin', (req, res) => {
  if (!req.user) {
    return res.status(404).render('auth/signin', {
      error: 'Sorry! We don’t recognize that email.'
    })
  }

  // Is the password correct?
  req.user.authenticate(req.body.password).then((match) => {
    if (match) {
      req.signIn(req.user)
      res.redirect('/')
      return
    }

    res.status(422).render('auth/signin', {
      email: req.body.email,
      error: 'Sorry! That password is incorrect.'
    })
  }).catch(res.error)
})
