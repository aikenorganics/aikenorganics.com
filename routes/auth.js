'use strict'

const db = require('../db')
const router = module.exports = require('ozymandias').Router()

// Find User
function findUser (req, res, next) {
  db.User.where('trim(lower(email)) = trim(lower(?))', req.body.email).find()
  .then((user) => {
    req.user = res.locals.user = user
    next()
  }).catch(res.error)
}

// Forgot
router.post('/forgot', findUser)
router.post('/forgot', (req, res) => {
  const expires_at = new Date()
  expires_at.setDate(expires_at.getDate() + 7)

  if (!req.user) {
    return res.status(422).json({
      email: ['Sorry! We don’t recognize that email.']
    })
  }

  db.Token.create({
    user_id: req.user.id,
    expires_at: expires_at
  }).then((token) => {
    return req.mail('mail/forgot', {
      to: [req.user.email],
      subject: `${process.env.NAME}: Password Reset`,
      url: `http://${req.get('host')}/signin/reset/${token.id}`
    })
  }).then(() => {
    res.json(true)
  }).catch(res.error)
})

// Reset
router.post('/reset/:token_id', (req, res) => {
  if ((req.body.password || '').length < 8) {
    return res.status(422).json({
      password: ['Sorry! Passwords must be at least eight characters long.']
    })
  }

  db.Token.include('user').find(req.params.token_id).then((token) => {
    if (!token || token.expires_at < new Date()) {
      return res.status(422).json({
        password: ['Sorry! That token is expired.']
      })
    }

    return token.user.update(req.permit('password')).then(() => {
      req.signIn(token.user)
      res.json(true)
    })
  }).catch(res.error)
})

// Sign Out
router.get('/signout', (req, res) => {
  req.signOut()
  res.redirect('/')
})

// Sign In
router.post('/signin', findUser)
router.post('/signin', (req, res) => {
  if (!req.user) {
    res.status(422).json({
      email: ['Sorry! We don’t recognize that email.']
    })
    return
  }

  // Is the password correct?
  req.user.authenticate(req.body.password).then((match) => {
    if (match) {
      req.signIn(req.user)
      res.json(true)
      return
    }

    res.status(422).json({
      password: ['Sorry! That password is incorrect.']
    })
  }).catch(res.error)
})
