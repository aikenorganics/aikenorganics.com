'use strict'

const json = require('../../json/admin/market')
const router = module.exports = require('ozymandias').Router()

// Index
router.get('/', (req, res) => res._react(json.index))

// Update
router.post('/', (req, res) => {
  req.market.update(req.permit('message', 'open')).then(() => {
    res.json(req.market)
  }).catch(res.error)
})
