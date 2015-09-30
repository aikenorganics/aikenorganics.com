'use strict'

let ozymandias = require('ozymandias')
let router = module.exports = ozymandias.Router()
let find = require('../../mid/find')
let db = require('../../db')

// Find
router.param('grower_id', find('grower', function () {
  return db.Grower.include({userGrowers: 'user'})
}))

// Index
router.get('/', function (req, res) {
  db.Grower.order('name').all().then(function (growers) {
    res.render('admin/growers/index', {growers: growers})
  }).catch(res.error)
})

// Edit
router.get('/:grower_id/edit', function (req, res) {
  let ids = db.UserGrower.select('user_id').where({grower_id: req.grower.id})
  db.User.not({id: ids}).all().then(function (users) {
    res.render('admin/growers/show', {users: users})
  }).catch(res.error)
})

// Add User
router.post('/:grower_id/adduser', function (req, res) {
  db.transaction(function () {
    db.UserGrower.create({
      user_id: req.body.user_id,
      grower_id: req.grower.id
    })
  }).then(function () {
    res.flash('success', 'User Added')
    res.redirect(`/admin/growers/${req.grower.id}/edit`)
  }).catch(res.error)
})

// Remove User
router.post('/:grower_id/removeuser', function (req, res) {
  db.transaction(function () {
    db.UserGrower.where({
      user_id: req.body.user_id,
      grower_id: req.grower.id
    }).delete()
  }).then(function () {
    res.flash('success', 'User Removed')
    res.redirect(`/admin/growers/${req.grower.id}/edit`)
  }).catch(res.error)
})

// Update
router.post('/:grower_id', function (req, res) {
  db.transaction(function () {
    req.grower.update(req.permit('active'))
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect(`/admin/growers/${req.grower.id}/edit`)
  }).catch(res.error)
})
