'use strict'

const json = require('../json/settings')
const router = module.exports = require('ozymandias').Router()

router.use((req, res, next) => {
  if (req.currentUser) return next()
  res.unauthorized()
})

// Index
router.get('/', (req, res) => res.react(json.index))

// Update
router.post('/', (req, res) => {
  req.currentUser.update(req.permit(
    'first', 'last', 'phone', 'street', 'city', 'state', 'zip'
  )).then(() => {
    res.json(json.update)
  }).catch(res.error)
})

// Card
router.post('/card', (req, res) => {
  req.currentUser.updateCard(req.body.token).then(() => {
    res.json(json.card)
  }).catch(res.error)
})
