'use strict'

let ozymandias = require('ozymandias')
let db = require('../../db')
let upload = require('multer')({dest: 'tmp/uploads'})
let router = module.exports = ozymandias.Router()

// Find
router.find('user_id', '_user', () => db.User.select(`exists(
  select id from orders where user_id = users.id
) as has_order`))

// Index
router.get('/', function (req, res) {
  let users = db.User

  if (req.query.search) {
    users = users.where(
      "search @@ to_tsquery('simple', ?)", `${req.query.search}:*`
    )
  }

  users.order('email').all().then(function (users) {
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
    req._user.update(req.permit(
      'email', 'first', 'last', 'phone', 'is_admin', 'member_until'
    ))
  }).then(function () {
    res.flash('success', 'Saved')
    res.redirect('/admin/users')
  }).catch(res.error)
})

// Image
router.post('/:user_id/image', upload.single('image'), function (req, res) {
  req._user.uploadImage(req.file).then(() => {
    res.flash('Image Uploaded.')
    res.redirect(req.body.return_to)
  }).catch(res.error)
})

// Delete
router.post('/:user_id/delete', function (req, res) {
  db.transaction(() => {
    req._user.destroy()
  }).then(() => {
    res.flash('User Deleted')
    res.redirect('/admin/users')
  }).catch(res.error)
})
