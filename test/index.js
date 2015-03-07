var test = require('tape');
var models = require('../models');

require('./auth');
require('./growers');
require('./home');
require('./posts');
require('./products');
require('./categories');

test('teardown', function(t) {
  models.close();
  t.end();
});
