var test = require('tape')
var db = require('../db')

require('./db')
require('./lib')
require('./mid')
require('./routes')

test('teardown', function (t) {
  db.close()
  t.end()
})
