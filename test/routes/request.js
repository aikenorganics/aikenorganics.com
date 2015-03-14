var request = require('supertest')
var app = require('../../app')

exports = module.exports = function () {
  var agent = request.agent(app)

  agent.signIn = function (email, next) {
    agent.post('/auth/signin')
    .field('email', email)
    .field('password', 'password')
    .end(next)
    return agent
  }

  return agent
}
