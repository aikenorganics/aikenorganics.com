'use strict'

const port = process.env.PORT
require('babel-register')({
  only: /client/,
  presets: ['react', 'es2015']
})
require('./app').listen(port)

console.log(`Listening on port ${port}`)
