'use strict'

const json = require('../json/settings')
const router = module.exports = require('ozymandias').Router()

router.use((request, response, next) => {
  if (request.currentUser) return next()
  response.unauthorized()
})

// Index
router.get('/', (request, response) => response.react(json.index))

// Update
router.post('/', (request, response) => {
  request.currentUser.update(request.permit(
    'first', 'last', 'phone', 'street', 'city', 'state', 'zip'
  )).then(() => {
    response.json(json.update)
  }).catch(response.error)
})

// Card
router.post('/card', (request, response) => {
  request.currentUser.updateCard(request.body.token).then(() => {
    response.json(json.card)
  }).catch(response.error)
})
