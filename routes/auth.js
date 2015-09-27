'use strict'

let bcrypt = require('bcrypt')
let crypto = require('crypto')
let ozymandias = require('ozymandias')
let find = require('../mid/_find')
let db = require('../db')

let router = module.exports = ozymandias.Router()

// Find Token
router.param('token_id', find('token', function () {
  return db.Token.include('user')
}))

// Find User
function findUser (req, res, next) {
  db.User.where('lower(email) = lower(?)', req.body.email).find()
  .then(function (user) {
    if (user) {
      req.user = res.locals.user = user
      return next()
    }
    res.status(404).render('auth/forgot', {
      error: 'Sorry! We don’t recognize that email.'
    })
  }).catch(res.error)
}

// Forgot
router.get('/forgot', function (req, res) {
  res.render('auth/forgot')
})

router.post('/forgot', findUser)
router.post('/forgot', function (req, res) {
  let expires_at = new Date()
  expires_at.setDate(expires_at.getDate() + 7)

  db.transaction(function () {
    return db.Token.create({
      user_id: req.user.id,
      expires_at: expires_at,
      id: crypto.randomBytes(20).toString('hex')
    })
  }).then(function (token) {
    return req.mail('mail/forgot', {
      to: [req.user.email],
      subject: 'Aiken Organics: Password Reset',
      url: `http://${req.get('host')}/auth/reset/${token.id}`
    })
  }).then(function () {
    res.flash('success', 'Thanks! We sent you an email to reset your password.')
    res.redirect('/')
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

  // Hash the password and store the user.
  bcrypt.hash(req.body.password, 12, function (e, hash) {
    if (e) {
      console.log(e)
      return res.status(500).render('500')
    }
    req.token.user.update({password: hash}).then(function () {
      res.flash('success', 'Password Changed')
      req.session.userId = req.token.user.id
      res.redirect('/')
    })
  })
})

// Sign Out
router.get('/signout', function (req, res) {
  req.session = null
  res.redirect('/')
})

// Sign In
router.get('/signin', function (req, res) {
  res.render('auth/signin')
})

router.post('/signin', findUser)
router.post('/signin', function (req, res) {
  let password = (req.body.password || '').trim()

  bcrypt.compare(password, req.user.password, function (e, match) {
    if (e) {
      console.log(e)
      return res.status(500).render('500')
    }

    // Is the password correct?
    if (!match) {
      res.status(422).render('auth/signin', {
        email: req.body.email,
        flash: 'Sorry! That password is incorrect.'
      })
      return
    }

    req.session.userId = req.user.id
    res.redirect('/')
  })
})

// Sign Up
router.get('/signup', function (req, res) {
  res.render('auth/signup')
})

router.post('/signup', function (req, res) {
  let email = (req.body.email || '').trim()
  let password = (req.body.password || '').trim()

  // Validate the password.
  if (password.length < 8) {
    res.status(422).render('auth/signup', {
      email: email,
      flash: 'Password must be at least eight characters long.'
    })
    return
  }

  // Validate the email.
  if (!/\S+@\S+\.\S+/.test(email)) {
    res.status(422).render('auth/signup', {
      flash: 'Please enter a valid email address.'
    })
    return
  }

  db.User.where('lower(email) = lower(?)', email).find().then(function (user) {
    // Does this user already exist?
    if (user) {
      res.status(422).render('auth/signup', {
        email: email,
        flash: 'That user already exists! Is it you?'
      })
      return
    }

    // Hash the password and store the user.
    bcrypt.hash(password, 12, function (e, hash) {
      if (e) {
        console.log(e)
        return res.status(500).render('500')
      }

      let params = req.permit('first', 'last', 'phone')
      params.email = email
      params.password = hash

      db.User.create(params).then(function (user) {
        req.session.userId = user.id
        res.redirect('/')
      })
    })
  })
})
