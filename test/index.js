'use strict'

const db = require('../db')
const test = require('./test')
const driver = require('./driver')

require('./db')
require('./lib')
require('./routes')
require('./integration')

test('teardown', function *(t) {
  driver.close()
  db.close()
})
