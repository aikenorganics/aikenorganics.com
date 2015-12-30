'use strict'

require('babel-register')({
  only: /client/,
  presets: ['es2015', 'react']
})

const test = require('tape')
const db = require('../db')

require('./db')
require('./lib')
require('./mid')
require('./routes')

test('teardown', (t) => {
  db.close()
  t.end()
})
