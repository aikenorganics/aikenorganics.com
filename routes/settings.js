'use strict'

const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.user) return next()
  res.status(404).render('404')
})

router.get('/account', (req, res) => {
  res.render('settings/account', {_user: req.user})
})

router.post('/account', (req, res) => {
  req.user.update(req.body, {
    fields: ['first', 'last', 'phone']
  }).then(() => {
    res.flash('success', 'Saved - thanks for being awesome!')
    res.redirect('/settings/account')
  })
})
