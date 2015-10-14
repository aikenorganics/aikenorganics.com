'use strict'

let test = require('tape')
let db = require('../db')

require('./db')
require('./lib')
require('./mid')
require('./routes')

test('teardown', (t) => {
  db.close()
  t.end()
})
