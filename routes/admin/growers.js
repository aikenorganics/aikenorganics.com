var express = require('express')
var router = module.exports = express.Router()
var find = require('../../mid/find')
var models = require('../../models')

router.param('grower_id', find(models.Grower, {
  include: [{
    model: models.UserGrower,
    as: 'userGrowers',
    include: [{model: models.User, as: 'user'}]
  }]
}))

router.get('/', function (req, res) {
  models.Grower.findAll({}).then(function (growers) {
    res.render('admin/growers/index', {growers: growers})
  })
})

router.get('/:grower_id/edit', function (req, res) {
  models.User.findAll({
    where: {
      id: {
        $notIn: req.grower.userGrowers.map(function (userGrower) {
          return userGrower.user_id
        })
      }
    }
  }).then(function (users) {
    res.render('admin/growers/show', {users: users})
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
