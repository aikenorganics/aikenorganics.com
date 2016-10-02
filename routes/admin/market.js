'use strict'

const json = require('../../json/admin/market')
const router = module.exports = require('ozymandias').Router()

// Index
router.get('/', (req, res) => res.react(json.index))

// Update
router.post('/', (req, res) => {
  req.market.update(req.permit('message', 'news', 'open')).then(() => {
    res.json(json.update)
  }).catch(res.error)
})
