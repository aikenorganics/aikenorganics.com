'use strict'

const json = require('../json/signin')
const Token = require('ozymandias/token')
const router = module.exports = require('ozymandias').Router()

// Signin
router.get('/', (req, res) => res.react(json.index))

// Forgot
router.get('/forgot', (req, res) => res.react(json.forgot))

// Reset
router.get('/reset/:tokenId', (req, res) => {
  Token.include('user').find(req.params.tokenId).then((token) => {
    res.react(json.reset, {
      token,
      expired: !token || token.expiresAt < new Date()
    })
  }).catch(res.error)
})
