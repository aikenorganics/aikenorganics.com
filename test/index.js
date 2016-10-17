'use strict'

const db = require('../db')
const app = require('../app')
const test = require('./test')
const server = app.listen(4444)

require('./db')
require('./lib')
require('./routes')
require('./integration')

test('teardown', function *(t) {
  server.close()
  db.close()
  test.driver.quit()
})
