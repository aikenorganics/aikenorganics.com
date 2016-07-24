'use strict'

const db = require('../db')
const app = require('../app')
const tape = require('tape')
const test = require('./test')
const server = app.listen(4444)

require('./db')
require('./lib')
require('./mid')
require('./routes')
require('./integration')

tape('teardown', (t) => {
  server.close()
  db.close()
  test.driver.quit()
  t.end()
})
