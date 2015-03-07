var request = require('supertest');
var User = require('../models').User;

exports = module.exports = function(app) {
  var agent = request.agent(app);

  agent.signIn = function(email, next) {
    agent.post('/auth/signin')
    .field('email', email)
    .field('password', 'password')
    .end(next);
    return agent;
  };

  return agent;
};

exports.getAdmin = function() {
  return User.find({where: {email: 'admin@example.com'}});
};

exports.getUser = function() {
  return User.find({where: {email: 'user@example.com'}});
};
