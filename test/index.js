var test = require('tape');
var models = require('../models');

require('./auth');
require('./cart');
require('./growers');
require('./home');
require('./posts');
require('./users');
require('./products');
require('./settings');
require('./categories');

test('teardown', function(t) {
  models.sequelize.close();
  t.end();
});
