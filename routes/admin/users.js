'use strict'

const db = require('../../db')
const json = require('../../json/admin/users')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('user', () => db.User.select(`exists(
  select id from orders where user_id = users.id
) as "hasOrder"`))

// Index
router.get('/', (req, res) => {
  let users = db.User

  // Search
  const {search} = req.query
  if (search) users = users.search(search)

  // Pagination
  const page = res.locals.page = +(req.query.page || 1)

  users.order('email').paginate(page, 100).then((users) => {
    res.react(json.index, {page, search, users})
  }).catch(res.error)
})

// Emails
router.get('/emails', (req, res) => {
  db.User.order('email').all().then((users) => {
    res.react(json.emails, {users})
  }).catch(res.error)
})

// Edit
router.get('/:userId/edit', (req, res) => {
  res.react(json.edit)
})

// New
router.get('/new', (req, res) => res.react(json.new))

// Create
router.post('/', (req, res) => {
  db.User.create(req.permit(
    'email', 'first', 'last', 'phone', 'memberUntil'
  )).then((user) => {
    res.json(json.create, {user})
  }).catch(res.error)
})

// Update
router.post('/:userId', (req, res) => {
  req.user.update(req.permit(
    'email', 'first', 'last', 'phone', 'isAdmin', 'memberUntil'
  )).then(() => {
    res.json(json.update)
  }).catch(res.error)
})

// Image
router.post('/:userId/image', (req, res) => {
  req.user.uploadImage(req).then(() => {
    res.json(json.image)
  }).catch(res.error)
})

// Delete
router.delete('/:userId', (req, res) => {
  req.user.destroy().then(() => res.json({})).catch(res.error)
})
