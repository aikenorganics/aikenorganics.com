var test = require('tape')
var models = require('../models')
var db = require('../db')

require('./db')
require('./lib')
require('./mid')
require('./models')
require('./routes')

test('teardown', function (t) {
  db.close()
  models.sequelize.close()
  t.end()
})
