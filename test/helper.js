var request = require('supertest');

module.exports = function(app) {
  var agent = request.agent(app);

  agent.signIn = function(email, next) {
    agent.post('/auth/signin')
    .field('email', 'admin@example.com')
    .field('password', 'password')
    .end(next);
    return agent;
  };

  return agent;
};
