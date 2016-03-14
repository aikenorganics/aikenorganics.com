'use strict'

const port = process.env.PORT
require('babel-register')({only: /client/})
require('./app').listen(port)

console.log(`Listening on port ${port}`)
