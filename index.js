require('babel-register')({
  only: /client/,
  presets: ['es2015', 'react']
})
require('./app').listen(process.env.PORT)
