'use strict'

const db = require('../db')
const json = require('../json/signin')
const router = module.exports = require('ozymandias').Router()

// Signin
router.get('/', (req, res) => res.react(json.index))

// Forgot
router.get('/forgot', (req, res) => res.react(json.forgot))

// Reset
router.get('/reset/:token_id', (req, res) => {
  db.Token.include('user').find(req.params.token_id).then((token) => {
    res.react(json.reset, {
      token,
      expired: !token || token.expires_at < new Date()
    })
  }).catch(res.error)
})
