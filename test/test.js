var tape = require('tape')
var request = require('supertest')
var app = require('../app')
var models = require('../models')
var signIn = require('./signin')

// Export a function with the tape API.
exports = module.exports = function (name, options, callback) {
  // Is the first argument the callback?
  if (typeof name === 'function') {
    callback = name
    name = ''
    options = {}
  }

  // Is the second argument the callback?
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  tape(name, options, function (t) {
    // Start a manual transaction.
    models.sequelize.transaction().then(function (transaction) {
      // Expose the transaction to the test and the app.
      t.transaction = transaction
      app.set('transaction', transaction)

      // Request without the app requirement.
      t.request = function () {
        return request(app)
      }

      // Sign in, with error handling.
      t.signIn = function (email) {
        return signIn(request.agent(app), email).catch(t.end)
      }

      // Rollback the transaction before ending the test.
      var end = t.end
      t.end = function () {
        transaction.rollback()
        end.apply(t, arguments)
      }

      callback(t)
    })
  })
}
