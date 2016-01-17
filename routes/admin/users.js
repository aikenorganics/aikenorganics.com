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
router.get('/', (req, res) => {
  let users = db.User

  if (req.query.search) {
    users = users.where(
      "search @@ to_tsquery('simple', ?)", `${req.query.search}:*`
    )
  }

  users.order('email').all().then((users) => {
    res.react({users: users})
  }).catch(res.error)
})

// Emails
router.get('/emails', (req, res) => {
  db.User.order('email').all().then((users) => {
    res.render('admin/users/emails', {users: users})
  }).catch(res.error)
})

// Edit
router.get('/:user_id/edit', (req, res) => {
  res.react({users: [req._user]})
})

// Update
router.post('/:user_id', (req, res) => {
  req._user.update(req.permit(
    'email', 'first', 'last', 'phone', 'is_admin', 'member_until'
  )).then(() => {
    res.json(true)
  }).catch(res.error)
})

// Image
router.post('/:user_id/image', upload.single('image'), (req, res) => {
  req._user.uploadImage(req.file).then(() => {
    res.json(req._user)
  }).catch(res.error)
})

// Delete
router.post('/:user_id/delete', (req, res) => {
  req._user.destroy().then(() => {
    res.flash('User Deleted')
    res.redirect('/admin/users')
  }).catch(res.error)
})
