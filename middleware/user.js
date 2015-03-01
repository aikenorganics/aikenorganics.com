var User = require('../models/user');

module.exports = function(req, res, next) {
  var id = req.signedCookies['aikenorganics-user-id'];
  if (!id) return next();
  User.find(id).then(function(user) {
    req.user = user;
    next();
  });
};
