'use strict'

const db = require('../db')
const json = require('../json/signup')
const router = module.exports = require('ozymandias').Router()

router.get('/', (req, res) => res.react(json.index))

// Validations
router.post('/', (req, res, next) => {
  db.User.where('trim(lower(email)) = trim(lower(?))', req.body.email).find()
  .then((user) => {
    if (!user) return next()
    res.status(422).json({
      email: ['That user already exists! Is it you?']
    })
  }).catch(res.error)
})

router.post('/', (req, res) => {
  db.User.create(req.permit(
    'first', 'last', 'phone', 'password', 'email'
  )).then((user) => {
    req.signIn(user)
    res.json({})
  }).catch(res.error)
})
