'use strict'

let ozymandias = require('ozymandias')
let db = require('../../db')
let find = require('../../mid/_find')
let upload = require('../../mid/image-upload')
let router = module.exports = ozymandias.Router()

// Find
router.param('user_id', find('_user', function () {
  return db.User
}))

// Index
router.get('/', function (req, res) {
  db.User.order('email').all().then(function (users) {
    res.render('admin/users/index', {users: users})
  }).catch(res.error)
})

// Emails
router.get('/emails', function (req, res) {
  db.User.order('email').all().then(function (users) {
    res.render('admin/users/emails', {users: users})
  }).catch(res.error)
})

// Edit
router.get('/:user_id/edit', function (req, res) {
  res.render('admin/users/edit')
})

// Update
router.post('/:user_id', function (req, res) {
  db.transaction(function () {
    let params = req.permit('first', 'last', 'phone', 'is_admin')
    req._user.update(params)
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/admin/users')
  }).catch(res.error)
})

// Image
router.post('/:user_id/image', upload('_user'))
