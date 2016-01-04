require('babel-register')({only: /client/})
require('./app').listen(process.env.PORT)
