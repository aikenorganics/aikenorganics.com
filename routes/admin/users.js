'use strict'

const db = require('../../db')
const json = require('../../json/admin/users')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('user', () => db.User.select(`exists(
  select id from orders where user_id = users.id
) as "hasOrder"`))

// Index
router.get('/', (request, response) => {
  let users = db.User

  // Search
  const {search} = request.query
  if (search) users = users.search(search)

  // Pagination
  const page = response.locals.page = +(request.query.page || 1)

  users.order('email').paginate(page, 100).then((users) => {
    response.react(json.index, {page, search, users})
  }).catch(response.error)
})

// Emails
router.get('/emails', (request, response) => {
  db.User.order('email').all().then((users) => {
    response.react(json.emails, {users})
  }).catch(response.error)
})

// Edit
router.get('/:userId/edit', (request, response) => {
  response.react(json.edit)
})

// New
router.get('/new', (request, response) => response.react(json.new))

// Create
router.post('/', (request, response) => {
  db.User.create(request.permit(
    'email', 'first', 'last', 'phone', 'memberUntil'
  )).then((user) => {
    response.json(json.create, {user})
  }).catch(response.error)
})

// Update
router.post('/:userId', (request, response) => {
  request.user.update(request.permit(
    'email', 'first', 'last', 'phone', 'isAdmin', 'memberUntil'
  )).then(() => {
    response.json(json.update)
  }).catch(response.error)
})

// Image
router.post('/:userId/image', (request, response) => {
  request.user.uploadImage(request).then(() => {
    response.json(json.image)
  }).catch(response.error)
})

// Delete
router.delete('/:userId', (request, response) => {
  request.user.destroy().then(() => response.json({})).catch(response.error)
})
