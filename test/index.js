var test = require('tape')
var models = require('../models')

require('./routes')
require('./models')

test('teardown', function (t) {
  models.sequelize.close()
  t.end()
})
