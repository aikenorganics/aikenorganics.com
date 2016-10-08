'use strict'

const db = require('../db')
const json = require('../json/signup')
const router = module.exports = require('ozymandias').Router()

router.get('/', (request, response) => response.react(json.index))

// Validations
router.post('/', (request, response, next) => {
  db.User.where('trim(lower(email)) = trim(lower(?))', request.body.email).find()
  .then((user) => {
    if (!user) return next()
    response.status(422).json({
      email: ['That user already exists! Is it you?']
    })
  }).catch(response.error)
})

router.post('/', (request, response) => {
  db.User.create(request.permit(
    'first', 'last', 'phone', 'password', 'email'
  )).then((user) => {
    request.signIn(user)
    response.json({})
  }).catch(response.error)
})
