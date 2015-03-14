var express = require('express')
var router = module.exports = express.Router()
var find = require('../../mid/find')
var models = require('../../models')

router.param('grower_id', find(models.Grower))

router.get('/', function (req, res) {
  models.Grower.findAll({}).then(function (growers) {
    res.render('admin/growers/index', {growers: growers})
  })
})

router.get('/:grower_id/edit', function (req, res) {
  Promise.all([
    req.grower.getUserGrowers({
      include: {model: models.User, as: 'user'}
    }),
    models.User.findAll({})
  ]).then(function (results) {
    req.grower.userGrowers = results[0]
    res.render('admin/growers/show', {users: results[1]})
  })
})

router.post('/:grower_id/adduser', function (req, res) {
  models.UserGrower.findOrCreate({
    where: {
      user_id: req.body.user_id,
      grower_id: req.grower.id
    }
  }).then(function (results) {
    res.flash('success', 'User Added')
    res.redirect(`/admin/growers/${req.grower.id}/edit`)
  })
})

router.post('/:grower_id/removeuser', function (req, res) {
  models.UserGrower.destroy({
    where: {
      user_id: req.body.user_id,
      grower_id: req.grower.id
    }
  }).then(function () {
    res.flash('success', 'User Removed')
    res.redirect(`/admin/growers/${req.grower.id}/edit`)
  })
})
