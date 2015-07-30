var bcrypt = require('bcrypt')
var crypto = require('crypto')
var ozymandias = require('ozymandias')
var mailer = require('../lib/mailer')
var find = require('../mid/find')
var models = require('../models')

var router = module.exports = ozymandias.Router()

router.param('token_id', find(models.Token, {
  include: [{model: models.User, as: 'user'}]
}))

router.get('/forgot', function (req, res) {
  res.render('auth/forgot')
})

router.post('/forgot', function (req, res) {
  models.User.find({
    where: ['lower(email) = lower(?)', req.body.email]
  }).then(function (user) {
    if (!user) {
      return res.status(404).render('auth/forgot', {
        error: 'Sorry! We don’t recognize that email.'
      })
    }

    var expires_at = new Date()
    expires_at.setDate(expires_at.getDate() + 7)

    user.createToken({
      id: crypto.randomBytes(20).toString('hex'),
      expires_at: expires_at
    }).then(function (token) {
      mailer({
        to: user.email,
        subject: 'Aiken Organics: Password Reset',
        body: `http://${req.get('host')}/auth/reset/${token.id}`
      }, function (e, data) {
        if (e) {
          console.error(e)
          return res.status(500).render('500')
        }
        res.flash('success', 'Thanks! We sent you an email to reset your password.')
        res.redirect('/')
      })
    })
  })
})

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

router.get('/signout', function (req, res) {
  req.session = null
  res.redirect('/')
})

router.get('/signin', function (req, res) {
  res.render('auth/signin')
})

router.post('/signin', function (req, res) {
  var email = (req.body.email || '').trim()
  var password = (req.body.password || '').trim()

  models.User.find({
    where: ['lower(email) = lower(?)', email]
  }).then(function (user) {
    // Does the user exist?
    if (!user) {
      res.status(404).render('auth/signin', {
        flash: 'Sorry! We can’t find a user with that email. Have you already registered?'
      })
      return
    }

    bcrypt.compare(password, user.password, function (e, match) {
      if (e) throw e

      // Is the password correct?
      if (!match) {
        res.status(422).render('auth/signin', {
          email: email,
          flash: 'Sorry! That password is incorrect.'
        })
        return
      }

      req.session.userId = user.id
      res.redirect('/')

    })

  })
})

router.get('/signup', function (req, res) {
  res.render('auth/signup')
})

router.post('/signup', function (req, res) {
  var email = (req.body.email || '').trim()
  var password = (req.body.password || '').trim()

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

  models.User.find({
    where: ['lower(email) = lower(?)', email]
  }).then(function (user) {
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
      models.User.create({
        email: email,
        password: hash,
        first: req.body.first,
        last: req.body.last,
        phone: req.body.phone
      }).then(function (user) {
        req.session.userId = user.id
        res.redirect('/')
      })
    })

  })
})
