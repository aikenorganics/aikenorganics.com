'use strict'

const json = require('../json/signin')
const router = module.exports = require('ozymandias').Router()

// Signin
router.get('/', (request, response) => response.react(json.index))

// Forgot
router.get('/forgot', (request, response) => response.react(json.forgot))
