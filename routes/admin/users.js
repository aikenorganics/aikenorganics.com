var ozymandias = require('ozymandias')
var models = require('../../models')
var find = require('../../mid/find')
var upload = require('../../mid/image-upload')
var router = module.exports = ozymandias.Router()

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

// Update
router.post('/:user_id', function (req, res) {
  req.transaction(function (t) {
    return req._user.update(req.body, {
      transaction: t,
      fields: ['first', 'last', 'phone', 'is_admin']
    }).then(function () {
      res.flash('success', 'Saved')
      res.redirect('/admin/users')
    })
  })
})

// Image
router.post('/:user_id/image', upload('_user'))
