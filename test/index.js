'use strict'

require('babel-register')({only: /client/})

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
