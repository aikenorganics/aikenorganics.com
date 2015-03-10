var test = require('tape');
var models = require('../models');

require('./auth');
require('./cart');
require('./growers');
require('./home');
require('./posts');
require('./products');
require('./settings');
require('./admin');
require('./orders');

require('./models');

test('teardown', function(t) {
  models.sequelize.close();
  t.end();
});
