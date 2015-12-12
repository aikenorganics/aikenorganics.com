'use strict'

const router = module.exports = require('ozymandias').Router()

// Index
router.get('/', (req, res) => res.render('admin/market/index'))

// Update
router.post('/', (req, res) => {
  req.market.update(req.permit('open')).then(function () {
    res.flash('success', 'Market Updated')
    res.redirect('/admin/market')
  })
})
