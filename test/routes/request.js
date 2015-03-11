var request = require('supertest')
var app = require('../../app')
var models = require('../../models')

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

exports.getAdmin = function () {
  return models.User.find({where: {email: 'admin@example.com'}})
}
