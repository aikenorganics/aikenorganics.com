'use strict'

let db = require('../../db')
let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()

// Index
router.get('/', function (req, res) {
  res.render('admin/market/index')
})

// Update
router.post('/', function (req, res) {
  db.transaction(function () {
    req.market.update(req.permit('open'))
  }).then(function () {
    res.flash('success', 'Market Updated')
    res.redirect('/admin/market')
  })
})
