var express = require('express')
var router = module.exports = express.Router()

// Index
router.get('/', function (req, res) {
  res.render('admin/market/index')
})

// Update
router.post('/', function (req, res) {
  req.transaction(function (transaction) {
    return req.market.update(req.body, {
      fields: ['open']
    }).then(function () {
      res.flash('success', 'Market Updated')
      res.redirect('/admin/market')
    })
  })
})
