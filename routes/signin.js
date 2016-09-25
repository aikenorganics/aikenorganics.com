'use strict'

const json = require('../json/signin')
const router = module.exports = require('ozymandias').Router()

// Signin
router.get('/', (req, res) => res.react(json.index))

// Forgot
router.get('/forgot', (req, res) => res.react(json.forgot))
