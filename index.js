'use strict'

const port = process.env.PORT
require('./app').listen(port)
console.log(`Listening on port ${port}`)
