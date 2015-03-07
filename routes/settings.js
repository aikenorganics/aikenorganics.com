var express = require('express');
var User = require('../models').User;

var router = module.exports = express.Router();

router.use(function(req, res, next) {
  if (req.user) return next();
  res.status(404).render('404');
});

router.get('/account', function(req, res) {
  res.render('settings/account', {_user: req.user});
});

router.post('/account', function(req, res) {
  req.user.updateAttributes(req.body, {
    fields: ['first', 'last', 'phone']
  }).then(function() {
    res.flash('success', 'Saved - thanks for being awesome!');
    res.redirect('/settings/account');
  });
});
