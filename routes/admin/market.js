'use strict'

const json = require('../../json/admin/market')
const router = module.exports = require('ozymandias').Router()

// Index
router.get('/', (request, response) => response.react(json.index))

// Update
router.post('/', (request, response) => {
  request.market.update(request.permit('message', 'news', 'open')).then(() => {
    response.json(json.update)
  }).catch(response.error)
})
