var express = require('express')
var models = require('../../models')
var find = require('../../mid/find')
var upload = require('../../mid/image-upload')
var router = module.exports = express.Router()

router.param('user_id', find(models.User, {name: '_user'}))

// Index
router.get('/', function (req, res) {
  models.User.findAll({
    order: [['email', 'ASC']]
  }).then(function (users) {
    res.render('admin/users/index', {users: users})
  })
})

// Emails
router.get('/emails', function (req, res) {
  models.User.findAll({
    order: [['email', 'ASC']]
  }).then(function (users) {
    res.render('admin/users/emails', {users: users})
  })
})

// Edit
router.get('/:user_id/edit', function (req, res) {
  res.render('admin/users/edit')
})

// Show
router.post('/:user_id', function (req, res) {
  req._user.update(req.body, {
    fields: ['first', 'last', 'phone', 'is_admin']
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/admin/users')
  })
})

// Image
router.post('/:user_id/image', upload('_user'))
