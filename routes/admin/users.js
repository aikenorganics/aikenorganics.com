'use strict'

const db = require('../../db')
const upload = require('multer')({dest: 'tmp/uploads'})
const router = module.exports = require('ozymandias').Router()

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
    res.react({emails: users.map((user) => user.email)})
  }).catch(res.error)
})

// Edit
router.get('/:user_id/edit', (req, res) => {
  res.react({user: req._user})
})

// New
router.get('/new', (req, res) => { res.react() })

// Create
router.post('/', (req, res) => {
  db.User.create(req.permit(
    'email', 'first', 'last', 'phone', 'member_until'
  )).then((user) => {
    res.json(user)
  }).catch(res.error)
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
router.delete('/:user_id', (req, res) => {
  req._user.destroy().then(() => res.json(true)).catch(res.error)
})
