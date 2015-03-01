var express = require('express');

// Export the Router
var router = module.exports = express.Router();

// Middleware
router.use(require('../middleware/user'));

router.get('/', function(req, res) {
  res.render('index');
});
