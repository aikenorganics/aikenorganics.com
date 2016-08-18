'use strict'

const db = require('../db')
const forgotMail = require('../mail/forgot')
const router = module.exports = require('ozymandias').Router()

// Find User
const findUser = (req, res, next) => {
  db.User.where('trim(lower(email)) = trim(lower(?))', req.body.email).find()
  .then((user) => {
    req.user = res.locals.user = user
    next()
  }).catch(res.error)
}

// Forgot
router.post('/forgot', findUser)
router.post('/forgot', (req, res) => {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  if (!req.user) {
    return res.status(422).json({
      email: ['Sorry! We don’t recognize that email.']
    })
  }

  db.Token.create({
    userId: req.user.id,
    expiresAt: expiresAt
  }).then((token) => (
    req.mail(forgotMail, {
      to: [req.user.email],
      subject: `${process.env.NAME}: Password Reset`,
      url: `http://${req.get('host')}/signin/reset/${token.id}`
    })
  )).then(() => {
    res.json({})
  }).catch(res.error)
})

// Reset
router.post('/reset/:tokenId', (req, res) => {
  if ((req.body.password || '').length < 8) {
    return res.status(422).json({
      password: ['Sorry! Passwords must be at least eight characters long.']
    })
  }

  db.Token.include('user').find(req.params.tokenId).then((token) => {
    if (!token || token.expiresAt < new Date()) {
      return res.status(422).json({
        password: ['Sorry! That token is expired.']
      })
    }

    return token.user.update(req.permit('password')).then(() => {
      req.signIn(token.user)
      res.json({})
    })
  }).catch(res.error)
})

// Sign Out
router.post('/signout', (req, res) => {
  req.signOut()
  res.json({})
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
      res.json({})
      return
    }

    res.status(422).json({
      password: ['Sorry! That password is incorrect.']
    })
  }).catch(res.error)
})
