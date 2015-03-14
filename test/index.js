var test = require('tape')
var models = require('../models')

require('./mid')
require('./models')
require('./routes')

test('teardown', function (t) {
  models.sequelize.close()
  t.end()
})
