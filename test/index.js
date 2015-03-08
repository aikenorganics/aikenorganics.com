var test = require('tape');
var models = require('../models');

require('./auth');
require('./growers');
require('./home');
require('./posts');
require('./users');
require('./market');
require('./products');
require('./settings');
require('./categories');

test('teardown', function(t) {
  models.close();
  t.end();
});
